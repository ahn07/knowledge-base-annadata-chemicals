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
  productId: "",
  supplier: "",
  quantity: 1,
  cost: "",
  transportCost: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function AdminPurchaseForm({ initialProducts = [] }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const selectedProduct = useMemo(
    () => initialProducts.find((product) => product.id === form.productId),
    [initialProducts, form.productId]
  );

  const totalCost = useMemo(() => {
    const cost = Number(form.cost);
    const transportCost = Number(form.transportCost);

    if (!Number.isFinite(cost) || !Number.isFinite(transportCost)) {
      return 0;
    }

    return cost + transportCost;
  }, [form.cost, form.transportCost]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setStatus("");
    setIsSaving(true);

    const payload = {
      productId: form.productId,
      supplier: form.supplier,
      quantity: Number(form.quantity),
      cost: Number(form.cost),
      transportCost: Number(form.transportCost),
      date: form.date,
    };

    const loadingId = toast.loading("Saving purchase...", "Processing");

    try {
      const response = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save purchase.");
      }

      setStatus("Purchase successfully recorded.");
      setForm({ ...initialForm, productId: form.productId });
      toast.success("Purchase successfully recorded.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save purchase.");
      toast.error(saveError.message || "Unable to save purchase.");
    } finally {
      toast.dismiss(loadingId);
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink">Purchase</p>
          <h2 className="mt-3 text-3xl font-bold text-ink">Add purchase entry</h2>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      {status ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {status}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_0.9fr]">
          <label className="block">
            <span className="text-sm font-semibold text-ink">Product</span>
            <select
              value={form.productId}
              onChange={(event) => setForm({ ...form, productId: event.target.value })}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
            >
              <option value="">Select product</option>
              {initialProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} — {product.category}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-ink">Supplier</span>
            <input
              type="text"
              value={form.supplier}
              onChange={(event) => setForm({ ...form, supplier: event.target.value })}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
              placeholder="Supplier name"
            />
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_0.9fr]">
          <label className="block">
            <span className="text-sm font-semibold text-ink">Quantity</span>
            <input
              type="number"
              min="1"
              step="1"
              value={form.quantity}
              onChange={(event) => setForm({ ...form, quantity: event.target.value })}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-ink">Cost per unit</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.cost}
              onChange={(event) => setForm({ ...form, cost: event.target.value })}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
            />
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_0.9fr]">
          <label className="block">
            <span className="text-sm font-semibold text-ink">Transport cost</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.transportCost}
              onChange={(event) => setForm({ ...form, transportCost: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-ink">Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
            />
          </label>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-steel">Total cost</p>
          <p className="mt-2 text-3xl font-bold text-ink">{formatCurrency(totalCost)}</p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-2xl bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving purchase..." : "Save purchase"}
          </button>
        </div>
      </form>
    </div>
  );
}
