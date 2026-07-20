const headers = [
  { key: "chemical", label: "Chemical" },
  { key: "cost", label: "Cost" },
  { key: "demand", label: "Demand" },
  { key: "profitability", label: "Profitability" },
  { key: "ease", label: "Ease of Manufacturing" },
  { key: "availability", label: "Raw Material Availability" },
  { key: "competition", label: "Market Competition" },
];

export default function ComparisonTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-900 text-white">
            <tr>
              {headers.map((header) => (
                <th key={header.key} className="px-4 py-4 text-left font-semibold tracking-wide">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((row) => (
              <tr key={row.chemical} className="transition hover:bg-mist">
                {headers.map((header) => (
                  <td
                    key={`${row.chemical}-${header.key}`}
                    className={`px-4 py-4 ${header.key === "chemical" ? "font-semibold text-ink" : "text-steel"}`}
                  >
                    {row[header.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
