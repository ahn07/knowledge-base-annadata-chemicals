import prisma from "../../../lib/prisma";

const LOW_STOCK_THRESHOLD = 10;

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const lowStockProducts = products.filter((product) => Number(product.stock) <= LOW_STOCK_THRESHOLD);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink">Inventory</p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Stock levels and low stock alerts</h2>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
            <p className="font-semibold text-ink">Low stock threshold</p>
            <p className="mt-1">{LOW_STOCK_THRESHOLD} units or less</p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Cost price</th>
                <th className="px-4 py-3 font-semibold">Selling price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-slate-500">
                    No inventory data available.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isLowStock = Number(product.stock) <= LOW_STOCK_THRESHOLD;
                  return (
                    <tr
                      key={product.id}
                      className={isLowStock ? "bg-amber-50" : "hover:bg-white"}
                    >
                      <td className="px-4 py-4 font-semibold text-ink">{product.name}</td>
                      <td className="px-4 py-4 text-steel">{product.category}</td>
                      <td className={`px-4 py-4 font-semibold ${isLowStock ? "text-amber-700" : "text-slate-700"}`}>
                        {product.stock}
                      </td>
                      <td className="px-4 py-4 text-steel">{formatCurrency(product.costPrice)}</td>
                      <td className="px-4 py-4 text-steel">{formatCurrency(product.sellingPrice)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {lowStockProducts.length > 0 ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-900">Low stock alert</p>
            <p className="mt-2 text-sm text-amber-700">
              {lowStockProducts.length} product{lowStockProducts.length > 1 ? "s" : ""} at or below the threshold.
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">
            All products are above the low stock threshold.
          </div>
        )}
      </div>
    </div>
  );
}
