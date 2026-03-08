import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import { FarmPulseProvider } from "./hooks/useFarmPulse";
import CommandCenterPage from "./pages/CommandCenterPage";
import FarmIntelligencePage from "./pages/FarmIntelligencePage";
import RiskMapPage from "./pages/RiskMapPage";
import SystemInsightsPage from "./pages/SystemInsightsPage";

export default function App() {
  return (
    <FarmPulseProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/command-center" replace />} />
          <Route path="/command-center" element={<CommandCenterPage />} />
          <Route path="/risk-map" element={<RiskMapPage />} />
          <Route path="/farm-intelligence" element={<FarmIntelligencePage />} />
          <Route path="/system-insights" element={<SystemInsightsPage />} />
        </Routes>
      </AppShell>
    </FarmPulseProvider>
  );
}
