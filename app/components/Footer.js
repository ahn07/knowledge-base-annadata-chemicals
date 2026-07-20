export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 text-sm text-slate-700 sm:px-6 md:grid-cols-[1.4fr_1fr] lg:px-8">
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-ink">Annadata kisan pvt ltd , ujjain Knowledge Base</h2>
          <p className="max-w-2xl leading-7">
            Practical learning material for understanding sulphate chemical manufacturing, plant setup,
            and India-focused business economics.
          </p>
        </div>
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
          <p className="font-semibold">Educational resource only</p>
          <p className="mt-3 leading-7 text-amber-900/90">
            Use this as an educational starting point. Final plant design, compliance, and financial decisions
            need qualified engineering, safety, pollution-control, and market validation.
          </p>
        </div>
      </div>
    </footer>
  );
}
