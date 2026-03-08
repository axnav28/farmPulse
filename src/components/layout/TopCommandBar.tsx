import { motion } from "framer-motion";
import { Radar, Satellite } from "lucide-react";
import { useFarmPulse } from "../../hooks/useFarmPulse";

export default function TopCommandBar() {
  const { lastScanAt, runScan, status } = useFarmPulse();

  return (
    <header className="panel relative overflow-hidden px-6 py-4">
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-64 bg-gradient-to-l from-cyan-200/55 to-transparent" />
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Satellite Crop Stress Monitoring Platform</p>
          <h1 className="text-[30px] font-bold leading-tight text-slate-900">FarmPulse AI</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-[12px] font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {status}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[12px] font-medium text-slate-600">
            <Radar className="h-3.5 w-3.5 text-cyan-600" />
            Last scan: {lastScanAt}
          </span>

          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={runScan}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_16px_28px_-18px_rgba(14,165,233,0.9)]"
          >
            <Satellite className="h-4 w-4" />
            Run Satellite Scan
          </motion.button>
        </div>
      </div>
    </header>
  );
}
