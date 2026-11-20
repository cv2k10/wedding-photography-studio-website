import { Hono, type Context } from "hono";
import { bodyLimit } from "hono/body-limit";
import { csrf } from "hono/csrf";
import { HTTPException } from "hono/http-exception";
import { renderToReadableStream } from "react-dom/server.browser";
import type { ReactNode } from "react";
import { eq } from "drizzle-orm";
import { connect, type Database } from "@/db";
import { bookings, bookingStatuses, packages, type BookingStatus } from "@/db/schema";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { siteConfig } from "@/lib/site";
import { parseBookingInput } from "@/lib/validation";
import { endAdminSession, hasAdminSession, startAdminSession, verifyAdminPassword, type WorkerEnv } from "@/lib/auth";
import HomePage, { metadata as home } from "@/pages/home";
import AboutPage, { metadata as about } from "@/pages/about";
import PackagesPage, { metadata as packagePage } from "@/pages/packages";
import PortfolioPage, { metadata as portfolio } from "@/pages/portfolio";
import BookingPage, { metadata as booking } from "@/pages/booking";
import AdminPage, { metadata as admin } from "@/pages/admin";

const app = new Hono<WorkerEnv>();
const db = (c: Context<WorkerEnv>) => connect(c.env.DB);
type Metadata = { title: string | { absolute: string }; description?: string };

async function page(c: Context<WorkerEnv>, metadata: Metadata, content: ReactNode, options: { admin?: boolean; status?: 400 | 404 | 422 } = {}) {
  const title = typeof metadata.title === "string" ? `${metadata.title} | ${siteConfig.name}` : metadata.title.absolute;
  const stream = await renderToReadableStream(
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description ?? siteConfig.description} />
        {options.admin && <meta name="robots" content="noindex" />}
        <title>{title}</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body className="bg-ivory font-sans text-ink antialiased">
        {options.admin ? content : <><SiteHeader /><main>{content}</main><SiteFooter /></>}
      </body>
    </html>,
  );
  c.header("Content-Type", "text/html; charset=utf-8");
  return c.body(stream, options.status ?? 200);
}

app.get("/", async (c) => page(c, home, await HomePage(db(c))));
app.get("/about", async (c) => page(c, about, await AboutPage(db(c))));
app.get("/packages", async (c) => page(c, packagePage, await PackagesPage(db(c))));
app.get("/portfolio", async (c) => page(c, portfolio, await PortfolioPage({ db: db(c), searchParams: c.req.query() })));
app.get("/booking", async (c) => page(c, booking, await BookingPage({ db: db(c), searchParams: c.req.query() })));

async function createBooking(database: Database, body: unknown) {
  const parsed = parseBookingInput(body);
  if (!parsed.ok) return parsed;
  const input = parsed.data;
  let packageName = "";
  if (input.packageId !== null) {
    const [pkg] = await database.select({ name: packages.name }).from(packages).where(eq(packages.id, input.packageId)).limit(1);
    if (!pkg) return { ok: false as const, error: "所选套系不存在，请刷新后重试" };
    packageName = pkg.name;
  }
  const [created] = await database.insert(bookings).values({ ...input, packageName }).returning({ id: bookings.id });
  return { ok: true as const, id: created.id };
}

const limit = bodyLimit({ maxSize: 16_384 });
app.post("/api/bookings", limit, async (c) => {
  let body: unknown;
  try { body = await c.req.json(); }
  catch { return c.json({ error: "请求格式不正确" }, 400); }
  const result = await createBooking(db(c), body);
  return result.ok ? c.json(result, 201) : c.json({ error: result.error }, 422);
});
app.post("/booking", limit, csrf(), async (c) => {
  let body: Record<string, unknown>;
  try { body = Object.fromEntries(await c.req.formData()); }
  catch { return c.text("请求格式不正确", 400); }
  const result = await createBooking(db(c), body);
  return page(c, booking, await BookingPage({
    db: db(c), searchParams: { package: String(body.packageId ?? "") },
    ...(result.ok ? { bookingId: result.id } : { errorText: result.error }),
  }), result.ok ? {} : { status: 422 });
});

app.get("/api/health", async (c) => {
  try {
    await c.env.DB.prepare("SELECT id FROM bookings LIMIT 1").all();
    return c.json({ ok: true });
  } catch {
    return c.json({ ok: false }, 500);
  }
});

app.use("/admin/*", async (c, next) => {
  c.header("Cache-Control", "no-store");
  await next();
}, limit, csrf());
app.get("/admin", async (c) => page(c, admin, await AdminPage({
  db: db(c), searchParams: c.req.query(), configured: Boolean(c.env.ADMIN_PASSWORD), authenticated: await hasAdminSession(c),
}), { admin: true }));
app.post("/admin/login", async (c) => {
  const form = await c.req.parseBody();
  const password = c.env.ADMIN_PASSWORD;
  if (!password || typeof form.password !== "string" || !(await verifyAdminPassword(form.password, password))) {
    return c.redirect("/admin?error=1", 303);
  }
  await startAdminSession(c, password);
  return c.redirect("/admin", 303);
});
app.post("/admin/logout", (c) => {
  endAdminSession(c);
  return c.redirect("/admin", 303);
});
app.post("/admin/status", async (c) => {
  if (!(await hasAdminSession(c))) return c.redirect("/admin", 303);
  const form = await c.req.parseBody();
  const id = Number(form.id);
  const status = form.status as BookingStatus;
  if (!Number.isSafeInteger(id) || id <= 0 || !bookingStatuses.includes(status)) return c.text("无效的预约状态", 400);
  await db(c).update(bookings).set({ status }).where(eq(bookings.id, id));
  return c.redirect("/admin", 303);
});

app.notFound((c) => page(c, { title: "页面不存在" }, <p className="p-12 text-center">页面不存在 · <a href="/">返回首页</a></p>, { status: 404 }));
app.onError((error, c) => {
  if (error instanceof HTTPException) return error.getResponse();
  console.error(error);
  return c.req.path.startsWith("/api/") ? c.json({ error: "服务器暂时不可用" }, 500) : c.text("服务器暂时不可用", 500);
});
export default app;
