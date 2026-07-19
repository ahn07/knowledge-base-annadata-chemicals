export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1.4fr_1fr] lg:px-8">
        <div>
          <h2 className="text-base font-bold text-ink">Annadata kisan pvt ltd , ujjain Knowledge Base</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-steel">
            Practical learning material for understanding sulphate chemical manufacturing, plant setup,
            and India-focused business economics.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Use this as an educational starting point. Final plant design, compliance, and financial decisions
          need qualified engineering, safety, pollution-control, and market validation.
        </div>
      </div>
    </footer>
  );
}
