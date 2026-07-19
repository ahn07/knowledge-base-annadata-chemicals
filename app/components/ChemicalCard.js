import ProcessFlow from "./ProcessFlow";

const accentStyles = {
  leaf: {
    panel: "border-leaf/20 bg-leaf/5",
    badge: "bg-leaf/10 text-leaf",
    bar: "bg-leaf",
  },
  copper: {
    panel: "border-copper/20 bg-copper/5",
    badge: "bg-copper/10 text-copper",
    bar: "bg-copper",
  },
  river: {
    panel: "border-river/20 bg-river/5",
    badge: "bg-river/10 text-river",
    bar: "bg-river",
  },
  zinc: {
    panel: "border-zinc/20 bg-zinc/5",
    badge: "bg-zinc/10 text-zinc",
    bar: "bg-zinc",
  },
};

function MiniList({ title, items }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-ink">{title}</h4>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-steel">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ChemicalCard({ chemical }) {
  const styles = accentStyles[chemical.accent] ?? accentStyles.leaf;

  return (
    <article
      id={chemical.id}
      className={`overflow-hidden rounded-lg border bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl ${styles.panel}`}
    >
      <div className={`h-1.5 ${styles.bar}`} />
      <div className="space-y-7 p-5 md:p-7">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-steel">{chemical.shortName}</p>
              <h3 className="mt-1 text-2xl font-bold text-ink">{chemical.name}</h3>
            </div>
            <div className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-ink shadow-sm ring-1 ring-slate-200">
              {chemical.formula}
            </div>
          </div>
          <p className="mt-4 leading-7 text-steel">{chemical.definition}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {chemical.badges.map((badge) => (
              <span key={badge} className={`rounded-md px-2.5 py-1 text-xs font-bold ${styles.badge}`}>
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {Object.entries(chemical.uses).map(([group, items]) => (
            <div key={group} className="rounded-lg border border-slate-200 bg-white p-4">
              <MiniList title={group} items={items} />
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-4">
            <div>
              <h4 className="text-sm font-bold text-ink">Formula & Reaction</h4>
              <p className="mt-2 text-sm text-steel">Formula: {chemical.formula}</p>
              <p className="mt-1 text-sm text-steel">Reaction: {chemical.reaction}</p>
            </div>
            <MiniList title="Raw Materials" items={chemical.rawMaterials} />
            <MiniList title="Composition" items={chemical.composition} />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h4 className="mb-3 text-sm font-bold text-ink">Manufacturing Process</h4>
            <ProcessFlow steps={chemical.manufacturing} />
            <div className="mt-4 rounded-md bg-mist p-3 text-sm leading-6 text-steel">
              <span className="font-semibold text-ink">India method:</span> {chemical.industrialMethod}
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <MiniList title="Plant Setup Units" items={chemical.plantUnits} />
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-bold text-ink">Costing & Economics</h4>
            <p className="mt-2 text-sm leading-6 text-steel">
              <span className="font-semibold text-ink">Setup:</span> {chemical.economics.setup}
            </p>
            <p className="mt-2 text-sm leading-6 text-steel">{chemical.economics.priceLogic}</p>
            <p className="mt-2 text-sm leading-6 text-steel">{chemical.economics.profitability}</p>
            <div className="mt-4">
              <MiniList title="Main Cost Drivers" items={chemical.economics.costDrivers} />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-bold text-ink">Market Insights</h4>
            <div className="mt-3 space-y-3 text-sm leading-6 text-steel">
              <p>
                <span className="font-semibold text-ink">Demand:</span> {chemical.marketInsights.demand}
              </p>
              <p>
                <span className="font-semibold text-ink">Price:</span> {chemical.marketInsights.priceRange}
              </p>
            </div>
            <div className="mt-4">
              <MiniList title="Key Buyers" items={chemical.marketInsights.buyers} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
