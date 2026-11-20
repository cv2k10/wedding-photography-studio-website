import { asc, eq } from "drizzle-orm";
import { type Database } from "@/db";
import { packages, portfolioItems, testimonials } from "@/db/schema";
import { PackageCard } from "@/components/PackageCard";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/lib/site";


export const metadata = {
  title: { absolute: `${siteConfig.name} | 婚纱摄影工作室` },
};

const HERO_IMAGE =
  "https://images.pexels.com/photos/3785644/pexels-photo-3785644.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1920&h=1080";

const highlights = [
  {
    no: "01",
    title: "定制化拍摄",
    desc: "先听你们的恋爱故事，再量身设计主题、场景与风格，每一组照片都独一无二。",
  },
  {
    no: "02",
    title: "一站式造型",
    desc: "专业化妆师、造型师与服装顾问全程陪伴，从妆造到礼服一站式搞定。",
  },
  {
    no: "03",
    title: "资深摄影团队",
    desc: "核心摄影师平均拥有 8 年以上经验，擅长自然光与纪实风格，捕捉真实情绪。",
  },
  {
    no: "04",
    title: "精修品质保障",
    desc: "严谨的后期流程，保留肤质与色彩质感，拒绝过度磨皮，成片经得起时间考验。",
  },
];

export default async function HomePage(db: Database) {
  const [featuredPackages, featuredWorks, reviews] = await Promise.all([
    db
      .select()
      .from(packages)
      .where(eq(packages.isFeatured, true))
      .orderBy(asc(packages.sortOrder), asc(packages.id))
      .limit(3),
    db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.isFeatured, true))
      .orderBy(asc(portfolioItems.sortOrder), asc(portfolioItems.id))
      .limit(6),
    db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.sortOrder), asc(testimonials.id))
      .limit(3),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[90vh] items-center overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="新人在落日余晖中相拥"
          fetchPriority="high"

          className="absolute inset-0 h-full w-full -z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink/85 via-ink/50 to-ink/10" />

        <div className="mx-auto w-full max-w-6xl px-6 py-28 text-white">
          <p className="animate-fade-up text-xs tracking-[0.5em] text-champagne md:text-sm">
            WEDDING PHOTOGRAPHY STUDIO
          </p>
          <h1 className="animate-fade-up mt-6 max-w-3xl font-serif text-5xl leading-[1.2] md:text-7xl">
            {siteConfig.slogan}
          </h1>
          <p className="animate-fade-up mt-6 max-w-xl text-base leading-8 text-white/85">
            从初次相遇到携手一生，拾光陪你把最美的故事装进画框。十余年专注婚纱摄影与婚礼跟拍，让每一个真实的笑容都被温柔珍藏。
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap gap-4">
            <a
              href="/booking"
              className="rounded-full bg-gold px-8 py-3.5 text-sm tracking-widest text-white shadow-lg shadow-black/20 transition hover:bg-gold-dark"
            >
              预约拍摄咨询
            </a>
            <a
              href="/portfolio"
              className="rounded-full border border-white/70 px-8 py-3.5 text-sm tracking-widest text-white transition hover:bg-white hover:text-ink"
            >
              浏览精选作品
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gold/20 bg-white/70">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
          {siteConfig.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-4xl text-gold md:text-5xl">{stat.value}</p>
              <p className="mt-3 text-xs tracking-[0.3em] text-muted md:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow="WHY CHOOSE US"
          title="为什么选择拾光"
          description="不只是拍照，更是为你们定制一段值得回看一生的故事。"
        />
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <div
              key={item.no}
              className="rounded-3xl bg-white p-8 ring-1 ring-gold/15 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/10"
            >
              <p className="font-serif text-4xl text-gold/70">{item.no}</p>
              <h3 className="mt-5 font-serif text-xl text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured packages */}
      <section className="bg-blush/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="PACKAGES"
            title="热门拍摄套系"
            description="多种套系灵活搭配，满足不同预算与拍摄需求。"
          />
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
          <div className="mt-14 text-center">
            <a
              href="/packages"
              className="text-sm tracking-widest text-gold underline-offset-8 hover:underline"
            >
              查看全部套系与价格 →
            </a>
          </div>
        </div>
      </section>

      {/* Featured works */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow="PORTFOLIO"
          title="精选作品"
          description="每一张照片都来自真实的拍摄现场，记录新人最自然的模样。"
        />
        <div className="mt-16 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
          {featuredWorks.map((work) => (
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
              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/85 to-transparent p-5 pt-16 text-white">
                <p className="text-xs tracking-widest text-champagne">{work.category}</p>
                <p className="mt-1 font-serif text-lg">{work.title}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-14 text-center">
          <a
            href="/portfolio"
            className="rounded-full border border-gold px-8 py-3 text-sm tracking-widest text-gold transition hover:bg-gold hover:text-white"
          >
            查看更多作品
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-ink py-24 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs tracking-[0.4em] text-gold">TESTIMONIALS</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">新人好评</h2>
            <div className="mx-auto mt-5 h-px w-14 bg-gold/70" />
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <figure
                key={review.id}
                className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-8"
              >
                <p className="tracking-[0.3em] text-gold">
                  {"★".repeat(Math.min(Math.max(review.rating, 1), 5))}
                </p>
                <blockquote className="mt-5 flex-1 text-sm leading-7 text-white/80">
                  “{review.content}”
                </blockquote>
                <figcaption className="mt-6 font-serif text-gold">— {review.coupleName}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold-dark">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-20 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="font-serif text-3xl text-white md:text-4xl">档期有限，期待与你相遇</h2>
            <p className="mt-3 text-sm text-white/85">
              热门日期建议提前 3–6 个月预约，留下信息，顾问将为你安排专属咨询。
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/booking"
              className="rounded-full bg-white px-8 py-3.5 text-sm tracking-widest text-gold-dark transition hover:bg-ivory"
            >
              立即预约
            </a>
            <a
              href={`tel:${siteConfig.phone}`}
              className="rounded-full border border-white/70 px-8 py-3.5 text-sm tracking-widest text-white transition hover:bg-white/10"
            >
              电话咨询
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
