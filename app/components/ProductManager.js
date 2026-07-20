"use client";

import { useMemo, useState } from "react";

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
  }).format(Number(value) || 0);
}

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "price", label: "Price" },
  { value: "stock", label: "Stock" },
  { value: "updated", label: "Updated" },
];

export default function ProductManager({ initialRates = [] }) {
  const [rates] = useState(initialRates || []);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading] = useState(false);
  const [error, setError] = useState("");

  const sortedRates = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = rates.filter((rate) => {
      return [rate.name, rate.category, rate.unit]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query));
    });

    return filtered.sort((a, b) => {
      const direction = sortOrder === "asc" ? 1 : -1;

      if (sortField === "price") {
        return (Number(a.sellingPrice) - Number(b.sellingPrice)) * direction;
      }

      if (sortField === "stock") {
        return (Number(a.stock) - Number(b.stock)) * direction;
      }

      if (sortField === "updated") {
        return (new Date(a.createdAt) - new Date(b.createdAt)) * direction;
      }

      return a.name.localeCompare(b.name) * direction;
    });
  }, [rates, search, sortField, sortOrder]);

  const exportDisabled = isLoading || sortedRates.length === 0;

  async function handleExportPdf() {
    try {
      const { jsPDF } = await import("jspdf");
      const autoTableModule = await import("jspdf-autotable");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const headers = [["Product", "Category", "Unit", "Cost", "Selling price", "Stock", "Updated"]];
      const rows = sortedRates.map((rate) => [
        rate.name,
        rate.category,
        rate.unit,
        formatCurrency(rate.costPrice),
        formatCurrency(rate.sellingPrice),
        rate.stock,
        formatDate(rate.createdAt),
      ]);

      doc.setFontSize(18);
      doc.text("Rate List", 40, 40);
      autoTableModule.default(doc, {
        head: headers,
        body: rows,
        startY: 70,
        theme: "striped",
        headStyles: { fillColor: [15, 23, 42], textColor: "#ffffff", halign: "left" },
        styles: { font: "helvetica", fontSize: 9, cellPadding: 6 },
      });
      doc.save(`rate-list-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (exportError) {
      console.error(exportError);
      alert("Unable to export PDF. Please retry.");
    }
  }

  async function handleExportExcel() {
    try {
      const XLSX = await import("xlsx");
      const sheetData = [
        ["Product", "Category", "Unit", "Cost", "Selling price", "Stock", "Updated"],
        ...sortedRates.map((rate) => [
          rate.name,
          rate.category,
          rate.unit,
          formatCurrency(rate.costPrice),
          formatCurrency(rate.sellingPrice),
          rate.stock,
          formatDate(rate.createdAt),
        ]),
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rate List");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `rate-list-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (exportError) {
      console.error(exportError);
      alert("Unable to export Excel file. Please retry.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink">Rate list</p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Live product rates</h2>
            <p className="mt-2 max-w-2xl text-sm text-steel">
              Search and sort the current rate table fetched from `/api/rates`.
            </p>
          </div>

          <div className="grid w-full gap-3 sm:max-w-md sm:grid-cols-[1fr_auto]">
            <label className="block">
              <span className="sr-only">Search rates</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by product, category, or unit"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
              />
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <select
                value={sortField}
                onChange={(event) => setSortField(event.target.value)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setSortOrder((current) => (current === "asc" ? "desc" : "asc"))}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100"
              >
                {sortOrder === "asc" ? "Asc" : "Desc"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={exportDisabled}
            onClick={handleExportPdf}
            className="rounded-2xl border border-ink bg-ink px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-950"
          >
            Export PDF
          </button>
          <button
            type="button"
            disabled={exportDisabled}
            onClick={handleExportExcel}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-ink transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-100"
          >
            Export Excel
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-soft">
        {rates.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            No rate data is available yet.
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="bg-slate-950 text-white">
              <tr>
                <th className="px-4 py-4 font-semibold">Product</th>
                <th className="px-4 py-4 font-semibold">Category</th>
                <th className="px-4 py-4 font-semibold">Unit</th>
                <th className="px-4 py-4 font-semibold">Cost</th>
                <th className="px-4 py-4 font-semibold">Selling price</th>
                <th className="px-4 py-4 font-semibold">Stock</th>
                <th className="px-4 py-4 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-slate-500">
                    Loading rate list...
                  </td>
                </tr>
              ) : sortedRates.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-slate-500">
                    No rates match your search.
                  </td>
                </tr>
              ) : (
                sortedRates.map((rate) => (
                  <tr key={rate.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-4 font-semibold text-ink">{rate.name}</td>
                    <td className="px-4 py-4 text-steel">{rate.category}</td>
                    <td className="px-4 py-4 text-steel">{rate.unit}</td>
                    <td className="px-4 py-4 text-steel">{formatCurrency(rate.costPrice)}</td>
                    <td className="px-4 py-4 font-semibold text-ink">{formatCurrency(rate.sellingPrice)}</td>
                    <td className="px-4 py-4 text-steel">{rate.stock}</td>
                    <td className="px-4 py-4 text-steel">{formatDate(rate.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
