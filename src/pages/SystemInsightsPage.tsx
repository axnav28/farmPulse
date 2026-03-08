import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFarmPulse } from "../hooks/useFarmPulse";

export default function SystemInsightsPage() {
  const { farms } = useFarmPulse();

  const byState = useMemo(() => {
    const states = ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh"] as const;
    return states.map((state) => {
      const list = farms.filter((farm) => farm.state === state);
      return {
        state,
        avgRisk: Number((list.reduce((sum, farm) => sum + farm.risk_score, 0) / list.length).toFixed(1))
      };
    });
  }, [farms]);

  const summary = useMemo(() => {
    const highRisk = farms.filter((farm) => farm.risk_score > 70).length;
    const warning = farms.filter((farm) => farm.risk_score >= 40 && farm.risk_score <= 70).length;
    const avgTemp = Number((farms.reduce((sum, farm) => sum + farm.temperature, 0) / farms.length).toFixed(1));
    return { highRisk, warning, avgTemp };
  }, [farms]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="panel p-5">
        <h2 className="mb-4 text-[21px] font-bold text-slate-900">Average Risk by State</h2>
        <div className="h-[350px]">
          <ResponsiveContainer>
            <BarChart data={byState}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="state" stroke="#64748b" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12, fontWeight: 600 }} />
              <Tooltip />
              <Bar dataKey="avgRisk" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-4">
        <section className="panel p-5">
          <h2 className="mb-3 text-[20px] font-bold text-slate-900">Pipeline Health</h2>
          <div className="space-y-2.5 text-[14px] font-medium text-slate-700">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">Satellite Ingestion: 99.2% uptime</div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">Stress Inference Runtime: 1.8s avg</div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">Alert Dispatch SLA: 96.7%</div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">Model Confidence: 0.93</div>
          </div>
        </section>

        <section className="panel p-5">
          <h3 className="mb-3 text-[18px] font-bold text-slate-900">Live Summary</h3>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-700">High Risk Farms</p>
              <p className="text-[30px] font-bold leading-none tabular-nums text-rose-800">{summary.highRisk}</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700">Warning Farms</p>
              <p className="text-[30px] font-bold leading-none tabular-nums text-amber-800">{summary.warning}</p>
            </div>
            <div className="rounded-xl border border-cyan-100 bg-cyan-50 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-700">Avg Temperature</p>
              <p className="text-[30px] font-bold leading-none tabular-nums text-cyan-800">{summary.avgTemp}°C</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
