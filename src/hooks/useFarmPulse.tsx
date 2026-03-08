import { createContext, useContext, useMemo, useState } from "react";
import { advisoryForFarm, generateFarms, simulateFarmUpdate } from "../data/farmData";
import type { Farm, KpiStat } from "../types/farm";

type AdvisoryPayload = {
  sms: string;
  officer: string;
};

type FarmPulseContextShape = {
  farms: Farm[];
  selectedFarm: Farm | null;
  lastScanAt: string;
  status: "Monitoring" | "Scanning";
  scanPulse: number;
  kpis: KpiStat[];
  setSelectedFarmId: (id: string | null) => void;
  runScan: () => void;
  generateAdvisory: (farm: Farm) => AdvisoryPayload;
};

const FarmPulseContext = createContext<FarmPulseContextShape | null>(null);

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function FarmPulseProvider({ children }: { children: React.ReactNode }) {
  const [farms, setFarms] = useState<Farm[]>(() => generateFarms());
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [status, setStatus] = useState<"Monitoring" | "Scanning">("Monitoring");
  const [scanTick, setScanTick] = useState(1);
  const [lastScanAt, setLastScanAt] = useState(formatTime(new Date()));

  const selectedFarm = useMemo(
    () => farms.find((farm) => farm.id === selectedFarmId) ?? farms[0] ?? null,
    [farms, selectedFarmId]
  );

  const kpis = useMemo(() => {
    const healthy = farms.filter((farm) => farm.stress_type === "healthy").length;
    const moderate = farms.filter((farm) => farm.risk_score >= 40 && farm.risk_score <= 70).length;
    const high = farms.filter((farm) => farm.risk_score > 70).length;

    return [
      { title: "Total Farms", value: farms.length, delta: 1.4 },
      { title: "Healthy Farms", value: healthy, delta: 2.1 },
      { title: "Moderate Risk Farms", value: moderate, delta: -0.8 },
      { title: "High Risk Farms", value: high, delta: 3.6 }
    ];
  }, [farms]);

  const runScan = () => {
    setStatus("Scanning");
    setScanTick((prev) => prev + 1);

    setTimeout(() => {
      setFarms((prev) => prev.map((farm) => simulateFarmUpdate(farm, scanTick)));
      setLastScanAt(formatTime(new Date()));
      setStatus("Monitoring");
    }, 1700);
  };

  const value: FarmPulseContextShape = {
    farms,
    selectedFarm,
    lastScanAt,
    status,
    scanPulse: scanTick,
    kpis,
    setSelectedFarmId,
    runScan,
    generateAdvisory: advisoryForFarm
  };

  return <FarmPulseContext.Provider value={value}>{children}</FarmPulseContext.Provider>;
}

export function useFarmPulse() {
  const ctx = useContext(FarmPulseContext);
  if (!ctx) {
    throw new Error("useFarmPulse must be used within FarmPulseProvider");
  }
  return ctx;
}
