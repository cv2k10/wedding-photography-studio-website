import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { photographers } from "@/db/schema";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "关于我们",
};

const STUDIO_IMAGE =
  "https://images.pexels.com/photos/34530271/pexels-photo-34530271.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1000";

const philosophy = [
  {
    title: "用心倾听",
    desc: "每一段爱情都独一无二，我们先听你们的故事，再举起相机。",
  },
  {
    title: "真实自然",
    desc: "拒绝千篇一律的模板，保留你们最真实的笑容、眼神与小动作。",
  },
  {
    title: "长久珍藏",
    desc: "精选纸张与装帧工艺，让影像陪伴你们走过每一个纪念日。",
  },
];

export default async function AboutPage() {
  const team = await db
    .select()
    .from(photographers)
    .orderBy(asc(photographers.sortOrder), asc(photographers.id));

  return (
    <>
      <section className="bg-ink py-24 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs tracking-[0.4em] text-gold">ABOUT US</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">关于拾光</h1>
          <p className="mt-8 text-base leading-8 text-white/80">
            拾光婚纱摄影成立于 2014 年，最初只是一间不足 80 平方米的小工作室。十余年来，我们陪伴了 8000 多对新人，走过无数个晨光与黄昏。我们始终相信，好的婚纱照不是“摆”出来的，而是在彼此凝视、相拥与欢笑的瞬间自然流露的。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading eyebrow="PHILOSOPHY" title="我们的理念" />
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {philosophy.map((item, index) => (
            <div key={item.title} className="rounded-3xl bg-white p-9 ring-1 ring-gold/15">
              <p className="font-serif text-4xl text-gold/70">0{index + 1}</p>
              <h3 className="mt-5 font-serif text-xl text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white/70 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="OUR TEAM"
            title="摄影团队"
            description="每一位摄影师都经过严格的选拔与培训，确保每场拍摄都有稳定的品质。"
          />
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <article key={member.id} className="rounded-3xl bg-white p-8 ring-1 ring-gold/15">
                <div className="flex items-center gap-5">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-champagne font-serif text-2xl text-gold">
                    {member.name.slice(0, 1)}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl text-ink">{member.name}</h3>
                    <p className="mt-1 text-sm text-gold">{member.title}</p>
                  </div>
                </div>
                {member.years > 0 ? (
                  <p className="mt-6 text-xs tracking-widest text-muted">从业 {member.years} 年</p>
                ) : null}
                <p className="mt-4 text-sm leading-7 text-muted">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-24 md:grid-cols-2">
        <div className="relative min-h-[360px] overflow-hidden rounded-3xl bg-champagne">
          <Image
            src={STUDIO_IMAGE}
            alt="户外婚纱拍摄"
            fill
            unoptimized
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center rounded-3xl bg-white p-10 ring-1 ring-gold/15">
          <h2 className="font-serif text-2xl text-ink">门店信息</h2>
          <dl className="mt-8 space-y-5 text-sm">
            <div>
              <dt className="text-muted">门店地址</dt>
              <dd className="mt-1 text-ink">{siteConfig.address}</dd>
            </div>
            <div>
              <dt className="text-muted">联系电话</dt>
              <dd className="mt-1 text-ink">{siteConfig.phone}</dd>
            </div>
            <div>
              <dt className="text-muted">微信 / 邮箱</dt>
              <dd className="mt-1 text-ink">
                {siteConfig.wechat} · {siteConfig.email}
              </dd>
            </div>
            <div>
              <dt className="text-muted">营业时间</dt>
              <dd className="mt-1 text-ink">{siteConfig.hours}</dd>
            </div>
          </dl>
          <Link
            href="/booking"
            className="mt-10 inline-flex w-fit rounded-full bg-gold px-8 py-3 text-sm tracking-widest text-white transition hover:bg-gold-dark"
          >
            预约到店参观
          </Link>
        </div>
      </section>
    </>
  );
}
