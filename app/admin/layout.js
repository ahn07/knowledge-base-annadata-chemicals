"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/sales", label: "Sales" },
  { href: "/admin/purchase", label: "Purchase" },
  { href: "/admin/inventory", label: "Inventory" },
];

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="lg:flex">
        <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white p-6 lg:block">
          <div className="mb-10">
            <Link href="/admin" className="text-2xl font-bold text-ink">
              Admin Panel
            </Link>
            <p className="mt-2 text-sm text-steel">
              Manage dashboard, products, sales, purchases, and inventory.
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-mist hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur px-4 py-4 shadow-sm sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admin area</p>
                <h1 className="mt-2 text-2xl font-bold text-ink">Control Center</h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="hidden overflow-x-auto rounded-2xl bg-slate-100 p-2 lg:flex lg:gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="inline-flex items-center justify-center rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
