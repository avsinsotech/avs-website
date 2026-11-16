import { Building2, Landmark, BrainCircuit, ShieldCheck, TrendingUp, Users, Wifi } from 'lucide-react';

// Illustrated hero: connected branches -> AVS core -> digital channels & AI.
export default function HeroVisual() {
  const nodes = [
    { x: 20, y: 12, icon: Building2, label: 'Branch' },
    { x: 10, y: 42, icon: Landmark, label: 'DCCB' },
    { x: 44, y: 94, icon: Users, label: 'Society' },
    { x: 80, y: 10, icon: ShieldCheck, label: 'KYC' },
    { x: 87, y: 40, icon: TrendingUp, label: 'Treasury' },
  ];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[600px] sm:aspect-[1/0.92]" aria-hidden>
      {/* glow */}
      <div className="absolute inset-[12%] rounded-full bg-gradient-to-br from-teal-300/40 via-teal-100/30 to-navy-200/40 blur-3xl" />

      {/* connection lines */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="hv-line" x1="0" x2="1">
            <stop offset="0" stopColor="#178FA7" stopOpacity=".15" />
            <stop offset="1" stopColor="#178FA7" stopOpacity=".7" />
          </linearGradient>
        </defs>
        {nodes.map((n, i) => (
          <path key={i} d={`M${n.x} ${n.y} Q ${(n.x + 50) / 2} ${(n.y + 50) / 2 - 8} 50 50`} fill="none" stroke="url(#hv-line)" strokeWidth=".35" strokeDasharray="1.2 1.2">
            <animate attributeName="stroke-dashoffset" from="10" to="0" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </path>
        ))}
        <path d="M50 50 Q 22 62 20 76" fill="none" stroke="url(#hv-line)" strokeWidth=".35" strokeDasharray="1.2 1.2">
          <animate attributeName="stroke-dashoffset" from="10" to="0" dur="2.2s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* satellite nodes */}
      {nodes.map((n, i) => (
        <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 animate-float" style={{ left: `${n.x}%`, top: `${n.y}%`, animationDelay: `${i * 0.7}s` }}>
          <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/90 px-3 py-2 shadow-lift backdrop-blur">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><n.icon className="h-4 w-4" /></span>
            <span className="hidden text-xs font-semibold text-navy-800 sm:inline">{n.label}</span>
          </div>
        </div>
      ))}

      {/* core hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-36 w-36 items-center justify-center rounded-[2rem] bg-gradient-to-br from-navy-800 to-navy-950 shadow-[0_30px_60px_-20px_rgba(8,21,43,.6)] sm:h-44 sm:w-44">
          <span className="absolute inset-0 rounded-[2rem] ring-1 ring-white/10" />
          <span className="absolute -inset-3 rounded-[2.4rem] border border-teal-500/30" />
          <span className="absolute -inset-7 rounded-[2.8rem] border border-teal-500/15" />
          <div className="text-center">
            <p className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">AVS</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[.2em] text-teal-300">Core Platform</p>
            <div className="mx-auto mt-3 flex w-fit items-center gap-1.5 rounded-full bg-teal-500/15 px-2.5 py-1 text-[10px] font-medium text-teal-200">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />Live
            </div>
          </div>
        </div>
      </div>

      {/* phone mock */}
      <div className="absolute bottom-[0%] right-[2%] hidden w-[32%] min-w-[150px] animate-float [animation-delay:1.2s] sm:block">
        <div className="rounded-[1.6rem] border-[5px] border-navy-900 bg-white p-3 shadow-lift">
          <div className="flex items-center justify-between text-[9px] text-navy-400"><span>9:41</span><Wifi className="h-3 w-3" /></div>
          <p className="mt-2 text-[9px] font-medium text-navy-400">Total Balance</p>
          <p className="font-display text-base font-bold text-navy-900">₹ 4,82,350</p>
          <div className="mt-2 h-10 rounded-lg bg-gradient-to-r from-teal-500 to-teal-400 p-2">
            <svg viewBox="0 0 100 24" className="h-full w-full"><path d="M0 18 L15 14 L30 16 L45 8 L60 11 L75 4 L100 6" fill="none" stroke="white" strokeWidth="2" /></svg>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {['Pay', 'Loans', 'FD'].map((t) => <div key={t} className="rounded-md bg-navy-50 py-1.5 text-center text-[8px] font-semibold text-navy-700">{t}</div>)}
          </div>
        </div>
      </div>

      {/* AI card */}
      <div className="absolute bottom-[6%] left-[0%] hidden w-[38%] min-w-[170px] animate-float [animation-delay:.4s] sm:block">
        <div className="rounded-2xl bg-navy-900 p-3.5 text-white shadow-lift">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500"><BrainCircuit className="h-4 w-4" /></span>
            <p className="text-xs font-semibold">Saarthi AI</p>
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-navy-200">Overdue follow-ups scheduled for today’s recovery calls.</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-3/4 rounded-full bg-gradient-to-r from-teal-400 to-teal-300" /></div>
        </div>
      </div>

    </div>
  );
}
