import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import FarmMap from "../components/map/FarmMap";
import { useFarmPulse } from "../hooks/useFarmPulse";

export default function RiskMapPage() {
  const { farms, selectedFarm, setSelectedFarmId, scanPulse } = useFarmPulse();

  const highRisk = useMemo(() => farms.filter((farm) => farm.risk_score > 70).sort((a, b) => b.risk_score - a.risk_score), [farms]);
  const warningCount = useMemo(() => farms.filter((farm) => farm.risk_score >= 40 && farm.risk_score <= 70).length, [farms]);
  const fallbackQueue = useMemo(
    () => [
      { id: "SIM-PB-901", village: "Bathinda", state: "Punjab", risk_score: 82 },
      { id: "SIM-HR-774", village: "Kaithal", state: "Haryana", risk_score: 79 },
      { id: "SIM-UP-668", village: "Hardoi", state: "Uttar Pradesh", risk_score: 84 },
      { id: "SIM-MP-552", village: "Sehore", state: "Madhya Pradesh", risk_score: 77 },
      { id: "SIM-UP-443", village: "Sitapur", state: "Uttar Pradesh", risk_score: 81 },
      { id: "SIM-HR-331", village: "Jind", state: "Haryana", risk_score: 76 }
    ],
    []
  );
  const queueItems = useMemo(() => {
    const base = highRisk.map((farm) => ({
      id: farm.id,
      village: farm.village,
      state: farm.state,
      risk_score: farm.risk_score
    }));
    return [...base, ...fallbackQueue].slice(0, 8);
  }, [fallbackQueue, highRisk]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:h-[calc(100vh-10.25rem)] xl:grid-cols-[minmax(0,1fr)_370px] xl:overflow-hidden">
      <section className="panel flex min-h-0 flex-col p-4">
        <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Total Monitored</p>
            <p className="text-2xl font-bold tabular-nums text-slate-900">{farms.length}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700">Warning Zones</p>
            <p className="text-2xl font-bold tabular-nums text-amber-800">{warningCount}</p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-700">Critical Zones</p>
            <p className="text-2xl font-bold tabular-nums text-rose-800">{highRisk.length}</p>
          </div>
        </div>
        <div className="h-[420px] sm:h-[500px] xl:min-h-0 xl:flex-1">
          <FarmMap
            farms={farms}
            selectedFarmId={selectedFarm?.id ?? null}
            scanPulse={scanPulse}
            onSelectFarm={setSelectedFarmId}
            heightClass="h-full"
          />
        </div>
      </section>

      <aside className="panel flex min-h-0 flex-col p-4">
        <h2 className="mb-3 text-[20px] font-bold text-slate-900">Critical Farm Queue</h2>
        <div className="max-h-[320px] space-y-2 overflow-y-auto sm:max-h-[380px] xl:max-h-none">
          {queueItems.map((farm) => (
            <button
              key={farm.id}
              onClick={() => {
                if (!farm.id.startsWith("SIM-")) setSelectedFarmId(farm.id);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-rose-300 hover:bg-rose-50"
            >
              <p className="text-[14px] font-bold text-slate-800">{farm.id}</p>
              <p className="text-xs font-medium text-slate-500">
                {farm.village}, {farm.state}
              </p>
              <div className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
                <AlertTriangle className="h-3.5 w-3.5" />
                Risk {farm.risk_score}/100
              </div>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
