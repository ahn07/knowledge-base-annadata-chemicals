export default function SectionBlock({ eyebrow, title, description, children, id }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-7 max-w-3xl">
        {eyebrow ? (
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-leaf">{eyebrow}</p>
        ) : null}
        <h2 className="text-2xl font-bold text-ink md:text-3xl">{title}</h2>
        {description ? <p className="mt-3 leading-7 text-steel">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
