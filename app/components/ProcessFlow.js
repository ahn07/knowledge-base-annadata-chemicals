export default function ProcessFlow({ steps }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li key={step} className="flex gap-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-slate-900 text-xs font-bold text-white">
            {index + 1}
          </span>
          <span className="text-sm leading-6 text-steel">{step}</span>
        </li>
      ))}
    </ol>
  );
}
