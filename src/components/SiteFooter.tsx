import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white/75">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl tracking-[0.18em] text-white">{siteConfig.name}</p>
          <p className="mt-1.5 text-[10px] tracking-[0.38em] text-gold">{siteConfig.nameEn}</p>
          <p className="mt-6 max-w-xs text-sm leading-7">{siteConfig.description}</p>
        </div>

        <div>
          <p className="text-sm tracking-widest text-gold">快速导航</p>
          <ul className="mt-5 space-y-3 text-sm">
            {[...siteConfig.nav, siteConfig.cta].map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition hover:text-gold">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm tracking-widest text-gold">联系我们</p>
          <ul className="mt-5 space-y-3 text-sm leading-6">
            <li>电话：{siteConfig.phone}</li>
            <li>微信：{siteConfig.wechat}</li>
            <li>邮箱：{siteConfig.email}</li>
            <li>地址：{siteConfig.address}</li>
            <li>营业时间：{siteConfig.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-white/50 md:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <a href="/admin" className="transition hover:text-gold">
            管理后台
          </a>
        </div>
      </div>
    </footer>
  );
}
