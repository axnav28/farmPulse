import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Send, X } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useFarmPulse } from "../../hooks/useFarmPulse";
import type { Farm } from "../../types/farm";

type DrawerProps = {
  farm: Farm | null;
  onClose: () => void;
};

function Gauge({ value }: { value: number }) {
  const color = value > 70 ? "#ef4444" : value >= 40 ? "#f59e0b" : "#16a34a";

  return (
    <div className="panel p-3">
      <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Risk Gauge</p>
      <div className="relative h-28">
        <div className="absolute left-1/2 top-full h-44 w-44 -translate-x-1/2 -translate-y-[67%] rounded-full border-[14px] border-slate-200" />
        <motion.div
          initial={{ rotate: -110 }}
          animate={{ rotate: -110 + (value / 100) * 220 }}
          className="absolute left-1/2 top-[68%] h-1.5 w-14 origin-left -translate-y-1/2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="absolute left-1/2 top-[68%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800" />
        <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-lg font-semibold text-slate-900">{value} / 100</p>
      </div>
    </div>
  );
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-700">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function IntelligenceDrawer({ farm, onClose }: DrawerProps) {
  const { generateAdvisory } = useFarmPulse();
  const [advisory, setAdvisory] = useState<{ sms: string; officer: string } | null>(null);

  return (
    <AnimatePresence>
      {farm && (
        <motion.aside
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 420, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="panel absolute bottom-2 left-2 right-2 z-[900] h-[46%] overflow-y-auto p-3 sm:h-[52%] sm:p-4 md:bottom-4 md:left-auto md:right-4 md:top-4 md:h-[calc(100%-2rem)] md:w-[min(420px,calc(100%-2rem))]"
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Farm Profile</p>
              <h3 className="text-lg font-semibold text-slate-900">{farm.id}</h3>
              <p className="text-sm text-slate-600">
                {farm.village}, {farm.state} · {farm.crop_type} · {farm.farm_size} ha
              </p>
            </div>
            <button onClick={onClose} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-100">
              <X className="h-4 w-4 text-slate-600" />
            </button>
          </div>

          <div className="space-y-3">
            <MetricBar label="NDVI vegetation index" value={Math.round(farm.NDVI * 100)} color="#06b6d4" />
            <MetricBar label="Soil moisture (NDWI)" value={Math.round(farm.NDWI * 100)} color="#3b82f6" />
            <MetricBar label="Temperature stress" value={Math.min(100, Math.round((farm.temperature / 45) * 100))} color="#f97316" />
          </div>

          <div className="mt-4">
            <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5" />
              {farm.stress_type === "healthy" ? "No critical stress detected" : `${farm.stress_type} detected`}
            </div>
          </div>

          <div className="panel mt-3 p-3">
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">AI Diagnosis Probabilities</p>
            <div className="h-44">
              <ResponsiveContainer>
                <BarChart data={farm.diagnosis} layout="vertical" margin={{ left: 0, right: 8 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis width={110} dataKey="label" type="category" tick={{ fontSize: 11, fill: "#334155" }} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.95)",
                      border: "1px solid rgba(148,163,184,0.35)",
                      borderRadius: "10px",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3">
            <Gauge value={farm.risk_score} />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3">
            <div className="panel p-3">
              <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">NDVI Trend (14 days)</p>
              <div className="h-32">
                <ResponsiveContainer>
                  <LineChart data={farm.ndviTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" hide />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} width={30} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="panel p-3">
              <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Temperature Trend (14 days)</p>
              <div className="h-32">
                <ResponsiveContainer>
                  <LineChart data={farm.tempTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" hide />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} width={30} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAdvisory(generateAdvisory(farm))}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Send className="h-4 w-4" />
            Generate Farmer Advisory
          </motion.button>

          {advisory && (
            <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">SMS:</span> {advisory.sms}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Officer Action:</span> {advisory.officer}
              </p>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
