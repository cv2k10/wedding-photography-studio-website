type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="text-center">
      <p className="text-xs tracking-[0.4em] text-gold">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">{title}</h2>
      <div className="mx-auto mt-5 h-px w-14 bg-gold/70" />
      {description ? (
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-muted md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
