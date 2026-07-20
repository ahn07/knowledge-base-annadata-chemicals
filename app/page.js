import ChemicalCard from "./components/ChemicalCard";
import ComparisonTable from "./components/ComparisonTable";
import FeaturedProducts from "./components/FeaturedProducts";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SectionBlock from "./components/SectionBlock";
import prisma from "../lib/prisma";
import { chemicals, comparisonRows, platformStats } from "../lib/chemicals";

export const dynamic = "force-dynamic";

function HeroIcon({ children }) {
  return (
    <span className="grid h-11 w-11 place-items-center rounded-lg border border-white/20 bg-white/10 text-lg text-white">
      {children}
    </span>
  );
}

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar />
      <main className="bg-mist">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 opacity-25">
            <div className="h-full w-full bg-[linear-gradient(120deg,#1f6f4a_0%,#1b5361_45%,#6e4f31_100%)]" />
          </div>
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:py-20 lg:px-8">
            <div>
              <div className="mb-5 inline-flex rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/80">
                India-focused sulphate manufacturing guide
              </div>
              <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
                Chemical Manufacturing Business Knowledge Platform
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
                Learn the basics, reactions, plant flow, costing logic, and business fit for
                magnesium sulphate, ferrous sulphate, and potassium sulphate.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#chemicals"
                  className="rounded-md bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  Explore Chemicals
                </a>
                <a
                  href="#comparison"
                  className="rounded-md border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Compare Economics
                </a>
              </div>
            </div>

            <div className="grid content-start gap-4">
              <div className="grid grid-cols-3 gap-3">
                {platformStats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="mt-1 text-xs leading-5 text-white/70">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur">
                <div className="mb-5 flex gap-3">
                  <HeroIcon>Mg</HeroIcon>
                  <HeroIcon>Fe</HeroIcon>
                  <HeroIcon>K</HeroIcon>
                  <HeroIcon>Zn</HeroIcon>
                </div>
                <h2 className="text-xl font-bold">From basics to plant-level decisions</h2>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  Built for scanning: definitions, uses, reactions, manufacturing steps, production
                  units, and India-specific economics are organized chemical by chemical.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 lg:px-8">
          <SectionBlock
            id="chemicals"
            eyebrow="Chemical profiles"
            title="Four practical sulphate product lines"
            description="Each profile moves from simple explanation to process flow, plant setup, and business economics."
          >
            <div className="grid gap-6">
              {chemicals.map((chemical) => (
                <ChemicalCard key={chemical.id} chemical={chemical} />
              ))}
            </div>
          </SectionBlock>

          <SectionBlock
            id="comparison"
            eyebrow="Decision matrix"
            title="Comparison table"
            description="Use this business matrix to compare cost, demand, profitability, manufacturing ease, raw material availability, and market competition."
          >
            <ComparisonTable rows={comparisonRows} />
          </SectionBlock>

          <FeaturedProducts products={products} />

          <SectionBlock
            id="economics"
            eyebrow="Business lens"
            title="India-focused economics checklist"
            description="Chemical manufacturing profit is shaped by quality control, local sourcing, utilities, compliance, and buyer specification."
          >
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  title: "Raw Material Strategy",
                  text: "Secure reliable acid supply, verify feedstock purity, and calculate losses before quoting bulk buyers.",
                },
                {
                  title: "Compliance & Safety",
                  text: "Plan storage, ventilation, scrubbers, effluent treatment, PPE, and pollution-control approvals early.",
                },
                {
                  title: "Market Positioning",
                  text: "Separate fertilizer, industrial, feed, pharma, and soluble grades because pricing and testing expectations differ.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
                  <h3 className="text-base font-bold text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-steel">{item.text}</p>
                </div>
              ))}
            </div>
          </SectionBlock>

          <section id="strategy" className="scroll-mt-24 rounded-lg bg-ink p-6 text-white shadow-soft md:p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Final business strategy</p>
                <h2 className="mt-2 text-2xl font-bold md:text-3xl">Start practical, then scale premium.</h2>
              </div>
              <p className="leading-7 text-white/75">
                Magnesium sulphate and ferrous sulphate are more suitable for low-capex entry and fast
                operational learning. Potassium sulphate can be a premium expansion path once the business
                has stronger compliance systems, utility planning, and buyer relationships.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
