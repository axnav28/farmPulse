import { motion } from "framer-motion";
import { Activity, BrainCircuit, Command, MapPinned } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const nav = [
  { label: "Command Center", to: "/command-center", icon: Command },
  { label: "Risk Map", to: "/risk-map", icon: MapPinned },
  { label: "Farm Intelligence", to: "/farm-intelligence", icon: BrainCircuit },
  { label: "System Insights", to: "/system-insights", icon: Activity }
];

const snapshot = [
  { label: "Active Alerts", value: "216", tone: "text-rose-700" },
  { label: "High Risk Farms", value: "78", tone: "text-amber-700" },
  { label: "Scan Uptime", value: "99.2%", tone: "text-emerald-700" }
];

const legend = [
  { label: "Healthy", dot: "bg-emerald-500" },
  { label: "Warning", dot: "bg-amber-500" },
  { label: "Critical", dot: "bg-rose-500" }
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="panel flex h-full min-h-full w-full flex-col px-4 py-5">
      <div className="rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-3">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-2 text-white shadow-[0_12px_24px_-12px_rgba(2,132,199,0.85)]">
            <Command className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-500">Operations Console</p>
            <p className="font-display text-[18px] font-bold leading-tight text-slate-900">National Command</p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <Link key={item.to} to={item.to} className="relative block">
              {active && (
                <motion.span
                  layoutId="active-sidebar"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-100 to-blue-100"
                />
              )}
              <span
                className={`relative flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                  active
                    ? "border-cyan-300/80 text-cyan-800"
                    : "border-slate-200 text-slate-600 hover:border-cyan-300 hover:bg-cyan-50/70 hover:text-cyan-700"
                }`}
              >
                <span
                  className={`rounded-lg p-2 ${
                    active ? "bg-white text-cyan-700 shadow-sm" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-display text-[15px] font-semibold leading-tight text-slate-800">{item.label}</span>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Live Snapshot</p>
          <div className="mt-2 space-y-2">
            {snapshot.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-[13px]">
                <span className="font-medium text-slate-600">{item.label}</span>
                <span className={`font-display text-[15px] font-bold tabular-nums ${item.tone}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Risk Legend</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {legend.map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center">
                <span className={`mx-auto mb-1 block h-2.5 w-2.5 rounded-full ${item.dot}`} />
                <p className="font-display text-[12px] font-semibold text-slate-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Mission Focus</p>
        <p className="mt-1 text-[14px] font-semibold leading-snug text-slate-700">Detect high-risk crop zones early and trigger advisories faster.</p>
      </div>
    </aside>
  );
}
