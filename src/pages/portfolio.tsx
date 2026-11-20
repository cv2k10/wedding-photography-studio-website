import { asc, desc, eq } from "drizzle-orm";
import { type Database } from "@/db";
import { portfolioItems } from "@/db/schema";
import { SectionHeading } from "@/components/SectionHeading";
import { portfolioCategories } from "@/lib/site";


export const metadata = {
  title: "作品展示",
};

type PortfolioPageProps = {
  db: Database;
  searchParams: { cat?: string };
};

export default async function PortfolioPage({ db, searchParams }: PortfolioPageProps) {
  const { cat } = searchParams;
  const requested = cat ?? "全部";
  const active = (portfolioCategories as readonly string[]).includes(requested) ? requested : "全部";

  const works = await db
    .select()
    .from(portfolioItems)
    .where(active === "全部" ? undefined : eq(portfolioItems.category, active))
    .orderBy(asc(portfolioItems.sortOrder), desc(portfolioItems.id));

  return (
    <>
      <section className="bg-blush/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="PORTFOLIO"
            title="作品展示"
            description="按风格浏览拾光的拍摄作品，总有一种风格属于你们。"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <nav className="flex flex-wrap justify-center gap-3">
          {portfolioCategories.map((item) => {
            const isActive = item === active;
            return (
              <a
                key={item}
                href={item === "全部" ? "/portfolio" : `/portfolio?cat=${encodeURIComponent(item)}`}
                className={`rounded-full px-5 py-2 text-sm tracking-widest transition ${
                  isActive
                    ? "bg-gold text-white"
                    : "border border-gold/40 text-ink/75 hover:border-gold hover:text-gold"
                }`}
              >
                {item}
              </a>
            );
          })}
        </nav>

        {works.length === 0 ? (
          <p className="mt-16 text-center text-muted">该分类暂时没有作品，敬请期待。</p>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
            {works.map((work) => (
              <figure
                key={work.id}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-champagne"
              >
                <img
                  src={work.imageUrl}
                  alt={work.title}
                  loading="lazy"

                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/85 via-ink/30 to-transparent p-5 pt-20 text-white">
                  <span className="rounded-full bg-white/15 px-3 py-0.5 text-xs tracking-widest backdrop-blur">
                    {work.category}
                  </span>
                  <p className="mt-3 font-serif text-xl">{work.title}</p>
                  {work.description ? (
                    <p className="mt-1 text-sm leading-6 text-white/75">{work.description}</p>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl bg-ink px-8 py-12 text-center text-white md:px-16">
            <h2 className="font-serif text-2xl md:text-3xl">想拍出同样的感觉？</h2>
            <p className="mt-3 text-sm text-white/75">告诉我们你们的风格偏好，顾问为你推荐最合适的拍摄方案。</p>
            <a
              href="/booking"
              className="mt-8 inline-block rounded-full bg-gold px-8 py-3 text-sm tracking-widest text-white transition hover:bg-gold-dark"
            >
              预约风格咨询
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
