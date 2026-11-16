// Layered architecture diagram for the Technology & Security page.
const layers = [
  { title: 'Channels', tone: 'from-teal-500 to-teal-400', items: ['Branch Web Application', 'Mobile Apps (Flutter)', 'Agent / BC App', 'Member Portal'] },
  { title: 'Security Gateway', tone: 'from-navy-600 to-navy-500', items: ['HTTPS', 'OTP / 2FA', 'Role-Based Access', 'Activity Logging'] },
  { title: 'Application & API Layer', tone: 'from-navy-700 to-navy-600', items: ['ASP.NET / C# Services', 'REST APIs', 'AI Services', 'Report Engine'] },
  { title: 'Data Layer', tone: 'from-navy-800 to-navy-700', items: ['Microsoft SQL Server', 'PostgreSQL', 'Encrypted Sensitive Data', 'Document Store'] },
  { title: 'Infrastructure', tone: 'from-navy-900 to-navy-800', items: ['Cloud / Dedicated Servers', 'Scheduled Backups', 'Disaster Recovery', 'Monitoring'] },
];

export default function ArchitectureDiagram() {
  return (
    <figure className="relative rounded-[2rem] border border-navy-100 bg-gradient-to-b from-white to-navy-50/60 p-5 shadow-card sm:p-8">
      <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
        <div className="space-y-3">
          {layers.map((l, i) => (
            <div key={l.title} className="relative">
              <div className={`grid items-center gap-3 rounded-2xl bg-gradient-to-r ${l.tone} p-4 text-white sm:grid-cols-[170px_1fr]`}>
                <p className="font-display text-sm font-semibold">{l.title}</p>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {l.items.map((it) => <span key={it} className="rounded-lg bg-white/10 px-2.5 py-2 text-center text-[11px] font-medium ring-1 ring-white/15 backdrop-blur">{it}</span>)}
                </div>
              </div>
              {i < layers.length - 1 && <div className="mx-auto h-3 w-px bg-teal-400" />}
            </div>
          ))}
        </div>
        <div className="grid gap-3 rounded-2xl border border-dashed border-teal-300 bg-teal-50/60 p-4">
          <p className="font-display text-sm font-semibold text-teal-800">External Integrations</p>
          {['KYC / Verification Services', 'CKYC Registry', 'FIU-IND Reporting', 'Payment Systems', 'SMS / WhatsApp / Email'].map((x) => (
            <span key={x} className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-navy-700 shadow-sm">{x}</span>
          ))}
          <p className="text-[11px] text-teal-700">Connected via secured REST APIs</p>
        </div>
      </div>
      <figcaption className="mt-5 text-center text-xs text-navy-400">Indicative AVS solution architecture. Deployment topology is configured per institution.</figcaption>
    </figure>
  );
}
