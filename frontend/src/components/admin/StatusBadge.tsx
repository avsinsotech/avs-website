const colors: Record<string, string> = {
  New: 'bg-teal-50 text-teal-700 ring-teal-200',
  Contacted: 'bg-blue-50 text-blue-700 ring-blue-200',
  'Demo Scheduled': 'bg-violet-50 text-violet-700 ring-violet-200',
  Qualified: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Closed: 'bg-navy-50 text-navy-500 ring-navy-200',
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${colors[status] ?? colors.Closed}`}>{status}</span>;
}
