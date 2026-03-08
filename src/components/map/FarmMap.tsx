import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { Farm } from "../../types/farm";

type FarmMapProps = {
  farms: Farm[];
  selectedFarmId: string | null;
  scanPulse: number;
  onSelectFarm: (id: string) => void;
  heightClass?: string;
};

function markerIcon(status: Farm["stress_type"], selected: boolean) {
  const statusClass =
    status === "healthy"
      ? "marker-healthy"
      : status === "water stress" || status === "nutrient deficiency"
        ? "marker-warning"
        : "marker-critical";

  return L.divIcon({
    className: "",
    html: `<span class="marker-dot ${statusClass} ${selected ? "marker-selected" : ""}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
}

const NATIONAL_HOTSPOTS = [
  { id: "hs-1", region: "Amritsar Belt, Punjab", lat: 31.2, lng: 74.8, risk: 72, stress: "Heat Stress", farms: 412, advisory: "Initiate evening irrigation cycle and district heat watch." },
  { id: "hs-2", region: "Karnal Cluster, Haryana", lat: 29.5, lng: 76.8, risk: 63, stress: "Water Stress", farms: 355, advisory: "Increase canal release for 48 hours and verify soil moisture." },
  { id: "hs-3", region: "Lucknow Periphery, Uttar Pradesh", lat: 26.9, lng: 80.9, risk: 68, stress: "Nutrient Deficiency", farms: 289, advisory: "Deploy foliar nutrition package in next 72 hours." },
  { id: "hs-4", region: "Sagar Corridor, Madhya Pradesh", lat: 24.5, lng: 78.1, risk: 75, stress: "Water Stress", farms: 426, advisory: "Prioritize groundwater pump support and staggered irrigation." },
  { id: "hs-5", region: "Ahmedabad Rural, Gujarat", lat: 23.0, lng: 72.6, risk: 59, stress: "Heat Stress", farms: 246, advisory: "Issue daytime heat advisory for field operations." },
  { id: "hs-6", region: "Surat Agri Belt, Gujarat", lat: 21.2, lng: 72.9, risk: 66, stress: "Water Stress", farms: 271, advisory: "Activate micro-irrigation support and moisture checks." },
  { id: "hs-7", region: "Marathwada Zone, Maharashtra", lat: 19.6, lng: 75.3, risk: 71, stress: "Water Stress", farms: 398, advisory: "Escalate drought mitigation package for vulnerable crops." },
  { id: "hs-8", region: "Hyderabad North, Telangana", lat: 17.8, lng: 78.5, risk: 70, stress: "Heat Stress", farms: 301, advisory: "Push anti-transpirant recommendation to field teams." },
  { id: "hs-9", region: "Krishna Delta, Andhra Pradesh", lat: 16.8, lng: 80.7, risk: 61, stress: "Nutrient Deficiency", farms: 264, advisory: "Conduct rapid nutrient audits in high-yield plots." },
  { id: "hs-10", region: "Belagavi Plains, Karnataka", lat: 15.5, lng: 74.1, risk: 58, stress: "Heat Stress", farms: 230, advisory: "Move irrigation windows to pre-sunrise schedule." },
  { id: "hs-11", region: "Bengaluru Rural, Karnataka", lat: 12.9, lng: 77.8, risk: 64, stress: "Nutrient Deficiency", farms: 286, advisory: "Recommend balanced NPK top-up in current growth phase." },
  { id: "hs-12", region: "Trichy Belt, Tamil Nadu", lat: 11.2, lng: 78.4, risk: 62, stress: "Water Stress", farms: 257, advisory: "Issue drip-irrigation optimization advisory immediately." },
  { id: "hs-13", region: "Central Kerala Farms", lat: 9.9, lng: 76.5, risk: 57, stress: "Nutrient Deficiency", farms: 211, advisory: "Target micronutrient correction in plantation blocks." },
  { id: "hs-14", region: "Hooghly Region, West Bengal", lat: 22.6, lng: 88.2, risk: 73, stress: "Water Stress", farms: 418, advisory: "Trigger district-level paddy moisture response plan." },
  { id: "hs-15", region: "Patna Agrarian Ring, Bihar", lat: 25.6, lng: 85.1, risk: 67, stress: "Heat Stress", farms: 333, advisory: "Activate heat and irrigation dual alert for officers." },
  { id: "hs-16", region: "Upper Assam Tea-Agri Mix", lat: 26.7, lng: 94.2, risk: 60, stress: "Nutrient Deficiency", farms: 239, advisory: "Run field nutrient sampling across affected blocks." },
  { id: "hs-17", region: "Imphal Valley, Manipur", lat: 24.8, lng: 93.9, risk: 56, stress: "Water Stress", farms: 173, advisory: "Increase local irrigation pumping support." },
  { id: "hs-18", region: "Coastal Odisha Zone", lat: 20.2, lng: 85.8, risk: 65, stress: "Heat Stress", farms: 292, advisory: "Roll out protective irrigation scheduling bulletin." },
  { id: "hs-19", region: "Jharkhand Plateau", lat: 23.3, lng: 86.5, risk: 69, stress: "Water Stress", farms: 318, advisory: "Coordinate emergency moisture conservation measures." },
  { id: "hs-20", region: "NCR Agricultural Fringe", lat: 28.3, lng: 77.2, risk: 55, stress: "Nutrient Deficiency", farms: 149, advisory: "Push low-dose nutrient correction campaign." },
  { id: "hs-21", region: "Uttarakhand Foothills", lat: 30.8, lng: 78.3, risk: 52, stress: "Heat Stress", farms: 126, advisory: "Monitor orchard heat stress and shade advisories." },
  { id: "hs-22", region: "Jammu Plains", lat: 33.1, lng: 74.9, risk: 54, stress: "Water Stress", farms: 137, advisory: "Recommend short-cycle irrigation during low-wind hours." },
  { id: "hs-23", region: "Rayalaseema Belt", lat: 14.5, lng: 79.8, risk: 74, stress: "Water Stress", farms: 441, advisory: "Escalate tanker + groundwater support for dry pockets." },
  { id: "hs-24", region: "North Coastal Andhra", lat: 18.8, lng: 83.1, risk: 71, stress: "Nutrient Deficiency", farms: 366, advisory: "Deploy extension teams for immediate soil nutrition plans." },
  { id: "hs-25", region: "Sikkim Foothill Farms", lat: 27.4, lng: 88.5, risk: 53, stress: "Heat Stress", farms: 101, advisory: "Maintain moderate irrigation and weekly scan review." }
];

function hotspotStyle(risk: number) {
  if (risk > 70) return { color: "#ef4444", fillColor: "#ef4444" };
  if (risk >= 55) return { color: "#eab308", fillColor: "#facc15" };
  return { color: "#22c55e", fillColor: "#4ade80" };
}

export default function FarmMap({
  farms,
  selectedFarmId,
  scanPulse,
  onSelectFarm,
  heightClass = "h-[420px] md:h-[540px]"
}: FarmMapProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 ${heightClass}`}>
      <MapContainer center={[22.2, 79.0]} zoom={4.7} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {NATIONAL_HOTSPOTS.map((zone) => {
          const style = hotspotStyle(zone.risk);
          return (
            <Circle
              key={zone.id}
              center={[zone.lat, zone.lng]}
              radius={zone.risk > 70 ? 56000 : 42000}
              pathOptions={{ color: style.color, fillColor: style.fillColor, fillOpacity: 0.18, weight: 1.5 }}
            >
              <Popup>
                <div className="w-64 text-sm">
                  <p className="font-semibold text-slate-900">{zone.region}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    Hotspot ID: {zone.id.toUpperCase()} · Active farms: {zone.farms}
                  </p>
                  <p className="mt-2 text-xs text-slate-700">
                    Risk: <span className="font-semibold">{zone.risk}/100</span> · Predicted stress:{" "}
                    <span className="font-semibold">{zone.stress}</span>
                  </p>
                  <p className="mt-2 text-xs text-slate-600">{zone.advisory}</p>
                </div>
              </Popup>
            </Circle>
          );
        })}

        <MarkerClusterGroup chunkedLoading>
          {farms.map((farm) => (
            <Marker
              key={farm.id}
              position={[farm.lat, farm.lng]}
              icon={markerIcon(farm.stress_type, selectedFarmId === farm.id)}
              eventHandlers={{ click: () => onSelectFarm(farm.id) }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{farm.id}</p>
                  <p>
                    {farm.village}, {farm.state}
                  </p>
                  <p>Risk: {farm.risk_score}/100</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <motion.div
        key={scanPulse}
        initial={{ y: "-120%" }}
        animate={{ y: "130%" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="pointer-events-none absolute left-0 top-0 h-20 w-full bg-gradient-to-b from-cyan-400/30 to-transparent"
      />

      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-600 backdrop-blur">
        Green: healthy | Yellow: warning | Red: critical
      </div>
    </div>
  );
}
