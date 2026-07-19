"use client";

import { useEffect, useMemo, useState } from "react";

const emptyForm = {
  productName: "",
  price: "",
  supplierName: "",
  date: "",
};

function formatDate(value) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const totalValue = useMemo(
    () => products.reduce((sum, product) => sum + Number(product.price || 0), 0),
    [products]
  );

  async function loadProducts({ showLoading = true } = {}) {
    if (showLoading) {
      setIsLoading(true);
    }
    setError("");

    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to fetch products.");
      }

      setProducts(data.products);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadProducts({ showLoading: false });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function openAddModal() {
    setEditingProduct(null);
    setForm(emptyForm);
    setError("");
    setIsModalOpen(true);
  }

  function openEditModal(product) {
    setEditingProduct(product);
    setForm({
      productName: product.productName,
      price: String(product.price),
      supplierName: product.supplierName,
      date: product.date || "",
    });
    setError("");
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    const payload = {
      ...form,
      price: Number(form.price),
    };

    const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
    const method = editingProduct ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save product.");
      }

      await loadProducts();
      closeModal();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(product) {
    const shouldDelete = window.confirm(`Delete ${product.productName}?`);

    if (!shouldDelete) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete product.");
      }

      setProducts((currentProducts) => currentProducts.filter((item) => item.id !== product.id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-widest text-steel">Entries</p>
          <p className="mt-2 text-3xl font-bold text-ink">{products.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-widest text-steel">Total listed value</p>
          <p className="mt-2 text-3xl font-bold text-ink">{formatCurrency(totalValue)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-widest text-steel">Mode</p>
          <p className="mt-2 text-3xl font-bold text-ink">CRUD</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-soft">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink">Product Rate List</h2>
            <p className="mt-1 text-sm text-steel">Add, edit, delete, and track supplier pricing.</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-md bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
          >
            Add Product
          </button>
        </div>

        {error ? (
          <div className="m-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-4 font-semibold">Product Name</th>
                <th className="px-4 py-4 font-semibold">Price</th>
                <th className="px-4 py-4 font-semibold">Supplier Name</th>
                <th className="px-4 py-4 font-semibold">Date</th>
                <th className="px-4 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-steel">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-steel">
                    No product entries yet. Add your first rate.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="transition hover:bg-mist">
                    <td className="px-4 py-4 font-bold text-ink">{product.productName}</td>
                    <td className="px-4 py-4 text-steel">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-4 text-steel">{product.supplierName}</td>
                    <td className="px-4 py-4 text-steel">{formatDate(product.date)}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-ink transition hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
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

      {isModalOpen ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/55 px-4 py-6">
          <div className="w-full max-w-xl rounded-lg bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="text-xl font-bold text-ink">
                  {editingProduct ? "Edit Product Entry" : "Add Product Entry"}
                </h2>
                <p className="mt-1 text-sm text-steel">Keep supplier pricing clean and current.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md px-3 py-2 text-sm font-bold text-steel transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 p-5">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-ink">Product Name</span>
                <input
                  value={form.productName}
                  onChange={(event) => setForm({ ...form, productName: event.target.value })}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                  placeholder="Magnesium Sulphate"
                  required
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-ink">Price (₹)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) => setForm({ ...form, price: event.target.value })}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                    placeholder="1200"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-bold text-ink">Date</span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm({ ...form, date: event.target.value })}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-ink">Supplier Name</span>
                <input
                  value={form.supplierName}
                  onChange={(event) => setForm({ ...form, supplierName: event.target.value })}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                  placeholder="Supplier or company name"
                  required
                />
              </label>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-ink transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-md bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
