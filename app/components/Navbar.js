import Link from "next/link";

const navItems = [
  { href: "/#chemicals", label: "Chemicals" },
  { href: "/#comparison", label: "Compare" },
  { href: "/#economics", label: "Economics" },
  { href: "/plant-process", label: "Plant Process" },
  { href: "/rate-list", label: "Rate List" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-sm font-bold text-white shadow-sm">
            AK
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">
              Annadata kisan pvt ltd , ujjain
            </p>
            <p className="text-xs text-steel">Knowledge Base</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-steel transition hover:bg-mist hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {" "}
          <a
            href="/admin"
            className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-yellow-600"
          >
            Admin
          </a>
          <a
            href="/rate-list"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Rate List
          </a>
        </div>
      </nav>
    </header>
  );
}
