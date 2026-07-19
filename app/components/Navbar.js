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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-sm font-bold text-white">
            AK
          </span>
          <span>
            <span className="block text-sm font-bold text-ink">Annadata kisan pvt ltd , ujjain</span>
            <span className="block text-xs text-steel">Knowledge Base</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-steel transition hover:bg-mist hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="/rate-list"
          className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
        >
          Rate List
        </a>
      </nav>
    </header>
  );
}
