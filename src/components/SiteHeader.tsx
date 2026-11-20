"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" onClick={() => setOpen(false)} className="flex flex-col leading-none">
          <span className="font-serif text-xl tracking-[0.18em] text-ink">{siteConfig.name}</span>
          <span className="mt-1.5 text-[10px] tracking-[0.38em] text-gold">{siteConfig.nameEn}</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-widest text-ink/75 transition hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={siteConfig.cta.href}
            className="rounded-full bg-gold px-6 py-2.5 text-sm tracking-widest text-white transition hover:bg-gold-dark"
          >
            {siteConfig.cta.label}
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="rounded-full border border-gold/50 px-4 py-1.5 text-sm text-ink md:hidden"
        >
          {open ? "关闭" : "菜单"}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-gold/20 bg-ivory md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-6 py-4">
            {[...siteConfig.nav, siteConfig.cta].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base text-ink transition hover:bg-blush"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
