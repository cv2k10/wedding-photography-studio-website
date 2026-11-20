import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex flex-col leading-none">
          <span className="font-serif text-xl tracking-[0.18em] text-ink">{siteConfig.name}</span>
          <span className="mt-1.5 text-[10px] tracking-[0.38em] text-gold">{siteConfig.nameEn}</span>
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm tracking-widest text-ink/75 transition hover:text-gold"
            >
              {item.label}
            </a>
          ))}
          <a
            href={siteConfig.cta.href}
            className="rounded-full bg-gold px-6 py-2.5 text-sm tracking-widest text-white transition hover:bg-gold-dark"
          >
            {siteConfig.cta.label}
          </a>
        </nav>

        <details className="md:hidden">
          <summary className="cursor-pointer rounded-full border border-gold/50 px-4 py-1.5 text-sm text-ink">菜单</summary>
          <nav className="absolute inset-x-0 top-full border-t border-gold/20 bg-ivory">
            <div className="mx-auto flex max-w-6xl flex-col px-6 py-4">
              {[...siteConfig.nav, siteConfig.cta].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-3 text-base text-ink transition hover:bg-blush"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
