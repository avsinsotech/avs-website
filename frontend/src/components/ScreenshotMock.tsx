// Placeholder "screenshot" frame. Replace with real product screenshots from the
// admin panel (Products → Images). Shown only until real images are uploaded.
export default function ScreenshotMock({ title, variant = 0 }: { title: string; variant?: number }) {
  const bars = [62, 80, 45, 90, 70, 55, 85];
  return (
    <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-lift">
      <div className="flex items-center gap-1.5 border-b border-navy-100 bg-navy-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <span className="ml-3 truncate text-[11px] text-navy-400">{title}</span>
      </div>
      <div className="grid grid-cols-[120px_1fr] min-h-[220px]">
        <div className="space-y-2 bg-navy-900 p-3">
          <div className="mb-4 h-3 w-12 rounded bg-teal-400" />
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className={`h-2 rounded ${i === variant % 6 ? 'bg-teal-400/80' : 'bg-white/15'}`} style={{ width: `${55 + ((i * 13) % 40)}%` }} />)}
        </div>
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-navy-100 p-2">
                <div className="h-1.5 w-10 rounded bg-navy-100" />
                <div className="mt-2 h-3 w-14 rounded bg-navy-800/80" />
              </div>
            ))}
          </div>
          {variant % 2 === 0 ? (
            <div className="flex h-24 items-end gap-2 rounded-lg border border-navy-100 p-3">
              {bars.map((b, i) => <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-teal-500 to-teal-300" style={{ height: `${b}%` }} />)}
            </div>
          ) : (
            <div className="space-y-1.5 rounded-lg border border-navy-100 p-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-teal-400" /><div className="h-2 flex-1 rounded bg-navy-100" /><div className="h-2 w-10 rounded bg-navy-200" /></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
