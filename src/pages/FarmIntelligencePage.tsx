import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFarmPulse } from "../hooks/useFarmPulse";

export default function FarmIntelligencePage() {
  const { farms, selectedFarm, setSelectedFarmId } = useFarmPulse();

  const tableData = useMemo(() => farms.slice().sort((a, b) => b.risk_score - a.risk_score), [farms]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:h-[calc(100vh-10.25rem)] xl:grid-cols-[360px_1fr] xl:overflow-hidden">
      <section className="panel flex min-h-0 flex-col p-4">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Farm Directory</h2>
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {tableData.map((farm) => (
            <button
              key={farm.id}
              onClick={() => setSelectedFarmId(farm.id)}
              className={`w-full rounded-xl border px-2.5 py-1.5 text-left transition ${
                selectedFarm?.id === farm.id
                  ? "border-cyan-300 bg-cyan-50"
                  : "border-slate-200 bg-white hover:border-cyan-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-[13px] font-semibold text-slate-800">{farm.id}</p>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  Risk {farm.risk_score}
                </span>
              </div>
              <p className="mt-0.5 text-[12px] font-medium text-slate-600">
                {farm.village}, {farm.state} · {farm.crop_type}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="min-h-0 grid grid-rows-[auto_1fr_1fr] gap-4 pr-1">
        {selectedFarm ? (
          <>
            <div className="panel p-4">
              <h3 className="text-xl font-semibold text-slate-900">{selectedFarm.id} Intelligence Report</h3>
              <p className="text-sm text-slate-600">
                {selectedFarm.village}, {selectedFarm.state} · {selectedFarm.crop_type} · {selectedFarm.farm_size} ha
              </p>
            </div>

            <div className="panel flex min-h-0 flex-col p-4">
              <h4 className="mb-3 text-base font-semibold text-slate-900">NDVI Decline Curve (14 days)</h4>
              <div className="min-h-0 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedFarm.ndviTrend}>
                    <defs>
                      <linearGradient id="ndviFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.06} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={[0, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#0891b2" strokeWidth={2} fill="url(#ndviFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="panel flex min-h-0 flex-col p-4">
              <h4 className="mb-3 text-base font-semibold text-slate-900">Temperature Trend (14 days)</h4>
              <div className="min-h-0 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedFarm.tempTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <div className="panel col-span-1 row-span-3 flex items-center justify-center p-4 text-slate-500">
            Select a farm from the directory.
          </div>
        )}
      </section>
    </div>
  );
}
