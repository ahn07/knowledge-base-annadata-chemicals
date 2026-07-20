export default function SectionBlock({ eyebrow, title, description, children, id }) {
  return (
    <section id={id} className="scroll-mt-24 py-10 sm:py-14">
      <div className="mb-8 max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-leaf">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-3xl font-semibold text-ink md:text-4xl">{title}</h2>
        {description ? <p className="mt-4 max-w-2xl leading-8 text-steel">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
