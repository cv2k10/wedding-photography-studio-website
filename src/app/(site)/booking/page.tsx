import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { BookingForm } from "@/components/BookingForm";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "预约咨询",
};

type BookingPageProps = {
  searchParams: Promise<{ package?: string }>;
};

const steps = [
  { title: "提交信息", desc: "填写新人信息、预计婚期与意向套系" },
  { title: "顾问回电", desc: "24 小时内电话或微信联系，了解你们的需求" },
  { title: "到店 / 视频沟通", desc: "面对面或视频看片，确定风格与拍摄方案" },
  { title: "锁定档期", desc: "支付定金，正式锁定拍摄日期" },
];

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { package: packageParam } = await searchParams;

  const options = await db
    .select({
      id: packages.id,
      name: packages.name,
      price: packages.price,
      category: packages.category,
    })
    .from(packages)
    .orderBy(asc(packages.category), asc(packages.sortOrder), asc(packages.id));

  const requestedId = Number(packageParam);
  const defaultPackageId = options.some((item) => item.id === requestedId) ? requestedId : null;

  return (
    <>
      <section className="bg-blush/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="BOOKING"
            title="预约拍摄咨询"
            description="留下你们的信息，我们的婚拍顾问将为你安排一次免费的一对一咨询。"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1fr_340px]">
        <BookingForm packages={options} defaultPackageId={defaultPackageId} />

        <aside className="space-y-8">
          <div className="rounded-3xl bg-ink p-8 text-white">
            <p className="text-xs tracking-[0.4em] text-gold">BOOKING FLOW</p>
            <ol className="mt-6 space-y-6">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="font-serif text-2xl text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-serif text-lg">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/70">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl bg-white p-8 ring-1 ring-gold/20">
            <p className="font-serif text-xl text-ink">直接联系我们</p>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
              <li>
                电话：
                <a href={`tel:${siteConfig.phone}`} className="text-ink transition hover:text-gold">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                微信：<span className="text-ink">{siteConfig.wechat}</span>
              </li>
              <li>
                地址：<span className="text-ink">{siteConfig.address}</span>
              </li>
              <li>
                营业：<span className="text-ink">{siteConfig.hours}</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
