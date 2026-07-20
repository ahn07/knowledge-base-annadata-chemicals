"use client";

import { useMemo, useState } from "react";
import { useToast } from "./ToastProvider";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

const initialForm = {
  name: "",
  category: "",
  unit: "",
  costPrice: "",
  sellingPrice: "",
  stock: "",
};

export default function AdminProductsManager({ initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((product) => {
        const fields = [product.name, product.category, product.unit].filter(Boolean);
        return query === "" || fields.some((field) => field.toLowerCase().includes(query));
      })
      .filter((product) => (categoryFilter ? product.category === categoryFilter : true));
  }, [products, search, categoryFilter]);

  function openAddMode() {
    setEditingProduct(null);
    setForm(initialForm);
    setError("");
    setStatusMessage("");
  }

  function openEditMode(product) {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      category: product.category || "",
      unit: product.unit || "",
      costPrice: product.costPrice ?? "",
      sellingPrice: product.sellingPrice ?? "",
      stock: product.stock ?? "",
      id: product.id,
    });
    setError("");
    setStatusMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setStatusMessage("");
    setIsSaving(true);

    const payload = {
      name: form.name,
      category: form.category,
      unit: form.unit,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      stock: Number(form.stock),
    };

    if (editingProduct) {
      payload.id = editingProduct.id;
    }

    try {
      const response = await fetch("/api/products", {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save product.");
      }

      const updatedProduct = data.product;

      if (editingProduct) {
        setProducts((current) => current.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)));
        setStatusMessage("Product updated successfully.");
      } else {
        setProducts((current) => [updatedProduct, ...current]);
        setStatusMessage("Product created successfully.");
      }

      openAddMode();
      toast.success(editingProduct ? "Product updated." : "Product added.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save product.");
      toast.error(saveError.message || "Unable to save product.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product? This action cannot be undone.")) {
      return;
    }

    setError("");
    setStatusMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete product.");
      }

      setProducts((current) => current.filter((product) => product.id !== id));
      setStatusMessage("Product deleted successfully.");
      toast.success("Product deleted.");
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete product.");
      toast.error(deleteError.message || "Unable to delete product.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink">Products</p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Manage product catalog</h2>
          </div>
          <button
            type="button"
            onClick={openAddMode}
            className="inline-flex items-center justify-center rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add product
          </button>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="block">
                  <span className="sr-only">Search products</span>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name, category, or unit"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10 sm:w-80"
                  />
                </label>
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-steel">{filteredProducts.length} products found</p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Unit</th>
                    <th className="px-4 py-3 font-semibold">Cost</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">Stock</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-10 text-center text-slate-500">
                        No products match your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-white">
                        <td className="px-4 py-4 font-semibold text-ink">{product.name}</td>
                        <td className="px-4 py-4 text-steel">{product.category}</td>
                        <td className="px-4 py-4 text-steel">{product.unit}</td>
                        <td className="px-4 py-4 text-steel">{formatCurrency(product.costPrice)}</td>
                        <td className="px-4 py-4 text-steel">{formatCurrency(product.sellingPrice)}</td>
                        <td className="px-4 py-4 text-steel">{product.stock}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => openEditMode(product)}
                              className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-ink transition hover:bg-mist"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(product.id)}
                              className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-steel">{editingProduct ? "Edit product" : "Add product"}</p>
                <h2 className="mt-2 text-xl font-bold text-ink">
                  {editingProduct ? "Update product details" : "Create a new product"}
                </h2>
              </div>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {error}
              </div>
            ) : null}

            {statusMessage ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                {statusMessage}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-ink">Product Name</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">Category</span>
                <input
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">Unit</span>
                <input
                  value={form.unit}
                  onChange={(event) => setForm({ ...form, unit: event.target.value })}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Cost Price</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.costPrice}
                    onChange={(event) => setForm({ ...form, costPrice: event.target.value })}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Selling Price</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.sellingPrice}
                    onChange={(event) => setForm({ ...form, sellingPrice: event.target.value })}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-ink">Stock</span>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) => setForm({ ...form, stock: event.target.value })}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                {editingProduct ? (
                  <button
                    type="button"
                    onClick={openAddMode}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-mist"
                  >
                    Cancel edit
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : editingProduct ? "Update product" : "Create product"}
                </button>
              </div>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
}
