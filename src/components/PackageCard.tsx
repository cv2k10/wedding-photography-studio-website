import type { Package } from "@/db/schema";

const formatPrice = (value: number) => `¥${value.toLocaleString("zh-CN")}`;

export function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-28px_rgba(45,39,37,0.4)] ring-1 ring-gold/15 transition duration-500 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-champagne">
        {pkg.coverImage ? (
          <img
            src={pkg.coverImage}
            alt={pkg.name}
            loading="lazy"

            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : null}
        {pkg.badge ? (
          <span className="absolute left-5 top-5 rounded-full bg-gold px-3 py-1 text-xs tracking-widest text-white">
            {pkg.badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-serif text-2xl text-ink">{pkg.name}</h3>
        <p className="mt-1 text-sm text-gold">{pkg.subtitle}</p>

        <div className="mt-5 flex items-end gap-3">
          <span className="font-serif text-3xl text-ink">{formatPrice(pkg.price)}</span>
          {pkg.originalPrice ? (
            <span className="pb-1 text-sm text-muted line-through">
              {formatPrice(pkg.originalPrice)}
            </span>
          ) : null}
        </div>

        <p className="mt-4 text-sm leading-7 text-muted">{pkg.description}</p>

        <ul className="mt-5 space-y-2.5 text-sm text-ink/85">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex gap-2.5">
              <span className="mt-0.5 text-gold">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <a
            href={`/booking?package=${pkg.id}`}
            className="block rounded-full border border-gold py-3 text-center text-sm tracking-widest text-gold transition hover:bg-gold hover:text-white"
          >
            预约此套系
          </a>
        </div>
      </div>
    </article>
  );
}
