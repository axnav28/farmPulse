import { useState } from "react";
import { motion } from "framer-motion";
import { Tractor, ShieldCheck, TriangleAlert, Waves } from "lucide-react";
import IntelligenceDrawer from "../components/intel/IntelligenceDrawer";
import KpiCard from "../components/kpi/KpiCard";
import FarmMap from "../components/map/FarmMap";
import { useFarmPulse } from "../hooks/useFarmPulse";

export default function CommandCenterPage() {
  const { farms, selectedFarm, setSelectedFarmId, kpis, scanPulse } = useFarmPulse();
  const [drawerCollapsed, setDrawerCollapsed] = useState(true);

  const spark = [
    [
      { x: "1", y: 20 },
      { x: "2", y: 21 },
      { x: "3", y: 22 },
      { x: "4", y: 24 },
      { x: "5", y: 26 }
    ],
    [
      { x: "1", y: 16 },
      { x: "2", y: 17 },
      { x: "3", y: 18 },
      { x: "4", y: 20 },
      { x: "5", y: 22 }
    ],
    [
      { x: "1", y: 10 },
      { x: "2", y: 11 },
      { x: "3", y: 10 },
      { x: "4", y: 9 },
      { x: "5", y: 9 }
    ],
    [
      { x: "1", y: 4 },
      { x: "2", y: 5 },
      { x: "3", y: 6 },
      { x: "4", y: 7 },
      { x: "5", y: 8 }
    ]
  ];

  return (
    <div className="relative space-y-4 pb-4">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <KpiCard title={kpis[0].title} value={kpis[0].value} delta={kpis[0].delta} icon={Tractor} spark={spark[0]} gradient="from-cyan-100 via-cyan-50 to-white" />
        <KpiCard title={kpis[1].title} value={kpis[1].value} delta={kpis[1].delta} icon={ShieldCheck} spark={spark[1]} gradient="from-emerald-100 via-emerald-50 to-white" />
        <KpiCard title={kpis[2].title} value={kpis[2].value} delta={kpis[2].delta} icon={Waves} spark={spark[2]} gradient="from-amber-100 via-yellow-50 to-white" />
        <KpiCard title={kpis[3].title} value={kpis[3].value} delta={kpis[3].delta} icon={TriangleAlert} spark={spark[3]} gradient="from-rose-100 via-orange-50 to-white" />
      </section>

      <section className="panel relative p-3">
        <FarmMap
          farms={farms}
          selectedFarmId={selectedFarm?.id ?? null}
          scanPulse={scanPulse}
          onSelectFarm={(id) => {
            setSelectedFarmId(id);
            setDrawerCollapsed(false);
          }}
        />
        {!drawerCollapsed ? (
          <IntelligenceDrawer farm={selectedFarm} onClose={() => setDrawerCollapsed(true)} />
        ) : (
          <motion.button
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setDrawerCollapsed(false)}
            className="absolute bottom-2 left-2 right-2 z-[900] flex h-10 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50/95 text-cyan-800 shadow-[0_12px_30px_-20px_rgba(14,165,233,0.8)] backdrop-blur md:bottom-auto md:left-auto md:right-4 md:top-4 md:h-[calc(100%-2rem)] md:w-10 md:rounded-2xl"
          >
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase md:[writing-mode:vertical-rl] md:rotate-180">
              Farm Profile
            </span>
          </motion.button>
        )}
      </section>
    </div>
  );
}
