import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { chemicals, processStats } from "../../lib/chemicals";

const accentMap = {
  leaf: "border-leaf/25 bg-leaf/5 text-leaf",
  copper: "border-copper/25 bg-copper/5 text-copper",
  river: "border-river/25 bg-river/5 text-river",
  zinc: "border-zinc/25 bg-zinc/5 text-zinc",
};

function FlowDiagram({ steps, accent }) {
  return (
    <div className="grid gap-3 md:grid-cols-6">
      {steps.map((step, index) => (
        <div key={step} className="relative">
          <div className={`h-full rounded-lg border bg-white p-3 shadow-sm ${accentMap[accent]}`}>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Step {index + 1}</p>
            <p className="mt-2 text-sm font-bold text-ink">{step}</p>
          </div>
          {index < steps.length - 1 ? (
            <span className="absolute -right-2 top-1/2 hidden h-0.5 w-4 bg-slate-300 md:block" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function LayoutBlocks({ zones }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {zones.map((zone) => (
        <div key={zone} className="rounded-lg border border-slate-200 bg-mist p-4">
          <div className="mb-3 h-2 rounded-full bg-slate-300" />
          <p className="text-sm font-bold text-ink">{zone}</p>
        </div>
      ))}
    </div>
  );
}

function CompactList({ title, items }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      <ul className="mt-3 grid gap-2">
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

export const metadata = {
  title: "Plant Process | Annadata kisan pvt ltd , ujjain",
  description:
    "Plant setup, process flow, layout design, machinery, and space requirements for sulphate chemical manufacturing.",
};

export default function PlantProcessPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-mist">
        <section className="bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">Plant setup guide</p>
            <div className="mt-4 grid gap-6 md:grid-cols-[1fr_0.7fr] md:items-end">
              <div>
                <h1 className="text-4xl font-bold md:text-5xl">Plant Process & Layout Design</h1>
                <p className="mt-4 max-w-2xl leading-7 text-white/72">
                  Practical flow, machinery, and space planning for sulphate chemical manufacturing.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {processStats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-white/15 bg-white/10 p-4">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="mt-1 text-xs leading-5 text-white/65">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
          {chemicals.map((chemical) => (
            <article key={chemical.id} id={chemical.id} className="rounded-lg border border-slate-200 bg-white shadow-soft">
              <div className="border-b border-slate-200 p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-steel">{chemical.shortName}</p>
                    <h2 className="mt-1 text-2xl font-bold text-ink">{chemical.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-steel">{chemical.tagline}</p>
                  </div>
                  <div className="rounded-lg bg-mist px-4 py-3 text-sm font-bold text-ink">
                    {chemical.formula}
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-5 md:p-6">
                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-steel">Process Flow</h3>
                  <FlowDiagram steps={chemical.plantFlow} accent={chemical.accent} />
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-steel">Plant Layout</h3>
                  <LayoutBlocks zones={chemical.plantLayout} />
                </div>

                <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                  <CompactList title="Machinery Required" items={chemical.machinery} />
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <h3 className="text-sm font-bold text-ink">Space Requirement</h3>
                    <div className="mt-3 grid gap-3">
                      <div className="rounded-md bg-mist p-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-steel">Approx land</p>
                        <p className="mt-1 text-lg font-bold text-ink">{chemical.space.land}</p>
                      </div>
                      <div className="rounded-md bg-mist p-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-steel">Expandability</p>
                        <p className="mt-1 text-sm leading-6 text-steel">{chemical.space.expandability}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
