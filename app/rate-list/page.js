import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductManager from "../components/ProductManager";

export const metadata = {
  title: "Rate List | Annadata kisan pvt ltd , ujjain",
  description: "Manage product prices, suppliers, and dates for Annadata kisan pvt ltd , ujjain.",
};

export default function RateListPage() {
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
                  Maintain product prices, supplier details, and rate dates in one clean table.
                </p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-4 text-sm leading-6 text-white/75">
                API routes available: GET, POST, PUT, and DELETE under /api/products.
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <ProductManager />
        </section>
      </main>
      <Footer />
    </>
  );
}
