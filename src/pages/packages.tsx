import { asc } from "drizzle-orm";
import { type Database } from "@/db";
import { packages } from "@/db/schema";
import { PackageCard } from "@/components/PackageCard";
import { SectionHeading } from "@/components/SectionHeading";


export const metadata = {
  title: "套系价格",
};

const notices = [
  {
    title: "锁定档期",
    desc: "确认套系后支付定金即可锁定拍摄日期，热门档期先到先得。",
  },
  {
    title: "自由加选",
    desc: "服装、造型、场景、相册与视频等均可按需加购，灵活搭配更省心。",
  },
  {
    title: "交付时间",
    desc: "婚纱摄影通常 30–45 个工作日交付精修成片，婚礼跟拍 15 个工作日内交付。",
  },
];

function GroupTitle({ en, zh }: { en: string; zh: string }) {
  return (
    <div className="flex flex-col items-start gap-2 border-b border-gold/20 pb-6">
      <p className="text-xs tracking-[0.4em] text-gold">{en}</p>
      <h2 className="font-serif text-3xl text-ink">{zh}</h2>
    </div>
  );
}

export default async function PackagesPage(db: Database) {
  const rows = await db
    .select()
    .from(packages)
    .orderBy(asc(packages.category), asc(packages.sortOrder), asc(packages.id));

  const photoPackages = rows.filter((item) => item.category === "photo");
  const weddingPackages = rows.filter((item) => item.category === "wedding");

  return (
    <>
      <section className="bg-blush/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="PRICING"
            title="套系价格"
            description="价格透明、内容清晰。如有特殊需求，可在预约时告诉我们，为你量身定制拍摄方案。"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-24 px-6 py-24">
        <div>
          <GroupTitle en="WEDDING PHOTOGRAPHY" zh="婚纱摄影套系" />
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {photoPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>

        {weddingPackages.length > 0 ? (
          <div>
            <GroupTitle en="WEDDING DAY" zh="婚礼跟拍" />
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {weddingPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="bg-white/70 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
          {notices.map((notice) => (
            <div key={notice.title} className="rounded-2xl border border-gold/20 bg-ivory p-7">
              <h3 className="font-serif text-lg text-ink">{notice.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{notice.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <a
            href="/booking"
            className="inline-block rounded-full bg-gold px-8 py-3.5 text-sm tracking-widest text-white transition hover:bg-gold-dark"
          >
            预约咨询，获取专属报价
          </a>
        </div>
      </section>
    </>
  );
}
