import prisma from "../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, sales, purchase] = await Promise.all([
    prisma.product.findMany(),
    prisma.sale.findMany(),
    prisma.purchase.findMany(),
  ]);

  const totalSales = sales.reduce((sum, item) => sum + Number(item.totalRevenue || 0), 0);
  const totalProfit = sales.reduce((sum, item) => sum + Number(item.profit || 0), 0);
  const totalPurchase = purchase.reduce((sum, item) => sum + Number(item.totalCost || 0), 0);
  const totalStock = products.reduce((sum, item) => sum + Number(item.stock || 0), 0);

  const metrics = {
    totalSales,
    totalPurchase,
    totalProfit,
    totalProducts: products.length,
    totalStock,
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink">Dashboard</p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Welcome back, admin.</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-steel">Total sales</p>
            <p className="mt-4 text-3xl font-bold text-ink">₹{metrics.totalSales.toLocaleString()}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-steel">Total purchase</p>
            <p className="mt-4 text-3xl font-bold text-ink">₹{metrics.totalPurchase.toLocaleString()}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-steel">Total profit</p>
            <p className="mt-4 text-3xl font-bold text-ink">₹{metrics.totalProfit.toLocaleString()}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-steel">Stock summary</p>
            <p className="mt-4 text-3xl font-bold text-ink">{metrics.totalStock.toLocaleString()}</p>
            <p className="mt-2 text-sm text-steel">{metrics.totalProducts} products</p>
          </div>
        </div>
      </div>
    </div>
  );
}
