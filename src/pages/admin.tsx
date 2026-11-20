import { desc } from "drizzle-orm";
import { type Database } from "@/db";
import { bookings, bookingStatuses, type BookingStatus } from "@/db/schema";


export const metadata = {
  title: "后台管理",
};

const statusLabel: Record<BookingStatus, string> = {
  pending: "待跟进",
  contacted: "已联系",
  booked: "已定档",
  cancelled: "已取消",
};

type AdminPageProps = {
  db: Database;
  authenticated: boolean;
  configured: boolean;
  searchParams: { error?: string; status?: string };
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default async function AdminPage({ db, searchParams, authenticated, configured }: AdminPageProps) {
  const { error, status } = searchParams;

  if (!authenticated) {
    return <LoginScreen failed={error === "1"} configured={configured} />;
  }

  const rows = await db.select().from(bookings).orderBy(desc(bookings.createdAt), desc(bookings.id));

  const activeStatus = (bookingStatuses as readonly string[]).includes(status ?? "")
    ? (status as BookingStatus)
    : null;
  const visible = activeStatus ? rows.filter((row) => row.status === activeStatus) : rows;
  const countBy = (value: BookingStatus) => rows.filter((row) => row.status === value).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="font-serif text-lg text-slate-900">拾光婚纱 · 后台管理</p>
            <p className="text-xs text-slate-500">预约线索与档期跟进</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a href="/" className="rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100">
              返回官网
            </a>
            <form method="post" action="/admin/logout">
              <button
                type="submit"
                className="rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-100"
              >
                退出登录
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="全部预约" value={rows.length} />
          <StatCard label="待跟进" value={countBy("pending")} accent="text-amber-600" />
          <StatCard label="已联系" value={countBy("contacted")} accent="text-sky-600" />
          <StatCard label="已定档" value={countBy("booked")} accent="text-emerald-600" />
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          <FilterLink href="/admin" active={activeStatus === null} label="全部" />
          {bookingStatuses.map((item) => (
            <FilterLink
              key={item}
              href={`/admin?status=${item}`}
              active={activeStatus === item}
              label={statusLabel[item]}
            />
          ))}
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-xs tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">提交时间</th>
                <th className="px-4 py-3 font-medium">新人</th>
                <th className="px-4 py-3 font-medium">联系方式</th>
                <th className="px-4 py-3 font-medium">预计婚期</th>
                <th className="px-4 py-3 font-medium">意向套系</th>
                <th className="px-4 py-3 font-medium">城市 / 场景</th>
                <th className="px-4 py-3 font-medium">留言</th>
                <th className="px-4 py-3 font-medium">跟进状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((row) => (
                <tr key={row.id} className="align-top hover:bg-slate-50/60">
                  <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                    {formatDateTime(row.createdAt)}
                    <div className="mt-1 text-xs text-slate-400">#{row.id}</div>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-900">{row.coupleName}</td>
                  <td className="px-4 py-4">
                    <div>{row.phone}</div>
                    {row.wechat ? (
                      <div className="mt-1 text-xs text-slate-500">微信：{row.wechat}</div>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">{row.weddingDate ?? "—"}</td>
                  <td className="px-4 py-4">{row.packageName || "待顾问推荐"}</td>
                  <td className="px-4 py-4">{row.city || "—"}</td>
                  <td className="max-w-xs px-4 py-4 text-slate-500">
                    <p className="line-clamp-3 whitespace-pre-wrap">{row.message || "—"}</p>
                  </td>
                  <td className="px-4 py-4">
                    <form method="post" action="/admin/status" className="flex items-center gap-2">
                      <input type="hidden" name="id" value={row.id} />
                      <select
                        name="status"
                        defaultValue={row.status}
                        className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm"
                      >
                        {bookingStatuses.map((item) => (
                          <option key={item} value={item}>
                            {statusLabel[item]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-white transition hover:bg-slate-700"
                      >
                        保存
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 ? (
            <p className="px-6 py-16 text-center text-sm text-slate-400">暂无预约记录</p>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, accent = "text-slate-900" }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <a
      href={href}
      className={`rounded-full px-4 py-1.5 text-sm transition ${
        active ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-slate-900"
      }`}
    >
      {label}
    </a>
  );
}

function LoginScreen({ failed, configured }: { failed: boolean; configured: boolean }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-6">
      <div className="w-full max-w-sm rounded-3xl bg-white p-10 shadow-xl ring-1 ring-slate-200">
        <p className="font-serif text-2xl text-slate-900">拾光 · 后台登录</p>
        <p className="mt-2 text-sm text-slate-500">请输入管理员密码以查看预约线索</p>

        {!configured ? (
          <p className="mt-6 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
            尚未配置 ADMIN_PASSWORD，请在 Cloudflare Worker 中设置此密钥。
          </p>
        ) : null}
        {configured && failed ? (
          <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-600">密码错误，请重试</p>
        ) : null}

        {configured && <form method="post" action="/admin/login" className="mt-6 space-y-4">
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="管理员密码"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 py-3 text-sm text-white transition hover:bg-slate-700"
          >
            登录
          </button>
        </form>}

        <a href="/" className="mt-6 block text-center text-sm text-slate-500 hover:text-slate-900">
          返回官网
        </a>
      </div>
    </div>
  );
}
