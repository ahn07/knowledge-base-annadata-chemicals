function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function FeaturedProducts({ products = [] }) {
  const featured = products.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink">Featured products</p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Product highlights</h2>
            <p className="mt-2 max-w-2xl text-sm text-steel">
              These featured items are rendered from the admin-managed product catalog.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
            <p className="font-semibold">Featured count</p>
            <p className="mt-1 text-2xl font-bold text-ink">{products.length}</p>
          </div>
        </div>

        {featured.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            No featured products are available yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((product) => (
              <article key={product.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      {product.category || "General"}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-ink">{product.name}</h3>
                  </div>
                  <span className="rounded-2xl bg-white px-3 py-1 text-sm font-semibold text-ink shadow-sm ring-1 ring-slate-200">
                    {product.unit}
                  </span>
                </div>

                <div className="grid gap-3 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3">
                    <span>Cost price</span>
                    <span className="font-semibold text-ink">{formatCurrency(product.costPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3">
                    <span>Selling price</span>
                    <span className="font-semibold text-ink">{formatCurrency(product.sellingPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3">
                    <span>Stock</span>
                    <span className="font-semibold text-ink">{product.stock}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3">
                    <span>Added</span>
                    <span>{formatDate(product.createdAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
