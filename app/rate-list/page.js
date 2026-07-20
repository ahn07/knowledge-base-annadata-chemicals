import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductManager from "../components/ProductManager";
import prisma from "../../lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Rate List | Annadata kisan pvt ltd , ujjain",
  description: "Manage product prices, suppliers, and dates for Annadata kisan pvt ltd , ujjain.",
};

export default async function RateListPage() {
  const rates = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-mist">
        <section className="bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">Rate management</p>
            <div className="mt-3 grid gap-4 md:grid-cols-[1fr_0.6fr] md:items-end">
              <div>
                <h1 className="text-4xl font-bold md:text-5xl">Product Rate List</h1>
                <p className="mt-4 max-w-2xl leading-7 text-white/72">
                  Browse the current rate list managed through the admin product database with search and sorting controls.
                </p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-4 text-sm leading-6 text-white/75">
                Rates are sourced from the admin-managed product catalog.
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <ProductManager initialRates={rates} />
        </section>
      </main>
      <Footer />
    </>
  );
}
