import type { DiagnosisPoint, Farm, FarmState, StressType } from "../types/farm";

const DAY_LABELS = ["D-13", "D-12", "D-11", "D-10", "D-9", "D-8", "D-7", "D-6", "D-5", "D-4", "D-3", "D-2", "D-1", "Today"];

const stateConfig: Record<
  FarmState,
  {
    villages: string[];
    crops: string[];
    center: { lat: number; lng: number };
  }
> = {
  Punjab: {
    villages: ["Moga", "Barnala", "Mansa", "Faridkot", "Sangrur", "Firozpur"],
    crops: ["Wheat", "Rice", "Cotton"],
    center: { lat: 30.9, lng: 75.85 }
  },
  Haryana: {
    villages: ["Karnal", "Rohtak", "Jind", "Hisar", "Sirsa", "Kaithal"],
    crops: ["Wheat", "Mustard", "Bajra"],
    center: { lat: 29.2, lng: 76.3 }
  },
  "Uttar Pradesh": {
    villages: ["Barabanki", "Hardoi", "Sitapur", "Etawah", "Prayagraj", "Meerut"],
    crops: ["Sugarcane", "Paddy", "Wheat"],
    center: { lat: 26.4, lng: 80.7 }
  },
  "Madhya Pradesh": {
    villages: ["Sehore", "Vidisha", "Dhar", "Ujjain", "Betul", "Chhindwara"],
    crops: ["Soybean", "Gram", "Wheat"],
    center: { lat: 23.6, lng: 77.5 }
  }
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function evaluateStress(ndvi: number, ndwi: number, temperature: number): StressType {
  if (ndvi < 0.42 && ndwi < 0.28) return "water stress";
  if (temperature > 37) return "heat stress";
  if (ndvi < 0.42 && ndwi >= 0.28) return "nutrient deficiency";
  return "healthy";
}

function computeRisk(ndvi: number, ndwi: number, temperature: number, stress: StressType) {
  const ndviRisk = Math.max(0, (0.72 - ndvi) / 0.72) * 44;
  const ndwiRisk = Math.max(0, (0.52 - ndwi) / 0.52) * 30;
  const tempRisk = Math.max(0, (temperature - 30) / 14) * 26;
  const bonus: Record<StressType, number> = {
    healthy: 0,
    "water stress": 12,
    "heat stress": 10,
    "nutrient deficiency": 8
  };
  return Math.round(clamp(ndviRisk + ndwiRisk + tempRisk + bonus[stress], 8, 99));
}

function diagnosisFromStress(stress: StressType): DiagnosisPoint[] {
  if (stress === "water stress") {
    return [
      { label: "Water Stress", value: 70 },
      { label: "Nutrient Deficiency", value: 20 },
      { label: "Pest Risk", value: 10 }
    ];
  }
  if (stress === "heat stress") {
    return [
      { label: "Water Stress", value: 28 },
      { label: "Nutrient Deficiency", value: 18 },
      { label: "Pest Risk", value: 54 }
    ];
  }
  if (stress === "nutrient deficiency") {
    return [
      { label: "Water Stress", value: 22 },
      { label: "Nutrient Deficiency", value: 64 },
      { label: "Pest Risk", value: 14 }
    ];
  }
  return [
    { label: "Water Stress", value: 12 },
    { label: "Nutrient Deficiency", value: 11 },
    { label: "Pest Risk", value: 9 }
  ];
}

export function generateTrend(base: number, variance: number, seed: number) {
  const rand = mulberry32(seed);
  return DAY_LABELS.map((day, index) => ({
    day,
    value: Number(clamp(base + (index - 7) * variance * 0.15 + (rand() - 0.5) * variance, 0, 100).toFixed(1))
  }));
}

export function createFarm(seed: number, state: FarmState, serial: number): Farm {
  const rand = mulberry32(seed + serial * 33);
  const config = stateConfig[state];
  const village = config.villages[Math.floor(rand() * config.villages.length)];
  const crop_type = config.crops[Math.floor(rand() * config.crops.length)];

  const NDVI = Number(clamp(0.3 + rand() * 0.55, 0.22, 0.9).toFixed(2));
  const NDWI = Number(clamp(0.18 + rand() * 0.55, 0.12, 0.82).toFixed(2));
  const temperature = Number((28 + rand() * 13).toFixed(1));
  const stress_type = evaluateStress(NDVI, NDWI, temperature);
  const risk_score = computeRisk(NDVI, NDWI, temperature, stress_type);

  return {
    id: `FP-${state.slice(0, 2).toUpperCase()}-${String(serial).padStart(3, "0")}`,
    village,
    state,
    crop_type,
    farm_size: Number((2 + rand() * 9).toFixed(1)),
    NDVI,
    NDWI,
    temperature,
    risk_score,
    stress_type,
    lat: Number((config.center.lat + (rand() - 0.5) * 2.2).toFixed(4)),
    lng: Number((config.center.lng + (rand() - 0.5) * 2.6).toFixed(4)),
    diagnosis: diagnosisFromStress(stress_type),
    ndviTrend: generateTrend(NDVI * 100, 8, seed + serial),
    tempTrend: generateTrend(temperature, 2.8, seed + serial * 3)
  };
}

export function generateFarms(): Farm[] {
  const states: FarmState[] = [
    "Punjab",
    "Punjab",
    "Punjab",
    "Punjab",
    "Punjab",
    "Punjab",
    "Punjab",
    "Punjab",
    "Haryana",
    "Haryana",
    "Haryana",
    "Haryana",
    "Haryana",
    "Haryana",
    "Haryana",
    "Haryana",
    "Uttar Pradesh",
    "Uttar Pradesh",
    "Uttar Pradesh",
    "Uttar Pradesh",
    "Uttar Pradesh",
    "Uttar Pradesh",
    "Uttar Pradesh",
    "Madhya Pradesh",
    "Madhya Pradesh",
    "Madhya Pradesh",
    "Madhya Pradesh",
    "Madhya Pradesh",
    "Madhya Pradesh",
    "Madhya Pradesh"
  ];

  return states.map((state, index) => createFarm(1911, state, index + 1));
}

export function simulateFarmUpdate(farm: Farm, tick: number): Farm {
  const drift = Math.sin((tick + farm.id.length) * 0.62) * 0.02;
  const heat = Math.cos((tick + farm.id.length) * 0.4) * 0.8;

  const NDVI = Number(clamp(farm.NDVI + drift - 0.012, 0.2, 0.9).toFixed(2));
  const NDWI = Number(clamp(farm.NDWI + drift * 0.8 - 0.01, 0.1, 0.82).toFixed(2));
  const temperature = Number(clamp(farm.temperature + heat + 0.25, 26, 43).toFixed(1));
  const stress_type = evaluateStress(NDVI, NDWI, temperature);
  const risk_score = computeRisk(NDVI, NDWI, temperature, stress_type);

  const nextNdviTrend = [...farm.ndviTrend.slice(1), { day: "Now", value: Number((NDVI * 100).toFixed(1)) }];
  const nextTempTrend = [...farm.tempTrend.slice(1), { day: "Now", value: temperature }];

  return {
    ...farm,
    NDVI,
    NDWI,
    temperature,
    stress_type,
    risk_score,
    diagnosis: diagnosisFromStress(stress_type),
    ndviTrend: nextNdviTrend,
    tempTrend: nextTempTrend
  };
}

export function advisoryForFarm(farm: Farm) {
  if (farm.stress_type === "water stress") {
    return {
      sms: `FarmPulse Alert: ${farm.village} ${farm.crop_type} shows water stress. Start micro-irrigation tonight and repeat in 24 hours.`,
      officer: "Coordinate temporary irrigation allocation and deploy soil moisture verification within 48 hours."
    };
  }

  if (farm.stress_type === "heat stress") {
    return {
      sms: `FarmPulse Alert: Heat stress rising for ${farm.crop_type} in ${farm.village}. Irrigate during early morning and apply anti-transpirant spray.`,
      officer: "Issue district heat advisory and prioritize shade/irrigation support for high-risk plots."
    };
  }

  if (farm.stress_type === "nutrient deficiency") {
    return {
      sms: `FarmPulse Alert: Nutrient deficiency trend in ${farm.village}. Apply recommended foliar nutrient mix this week.`,
      officer: "Arrange rapid NPK field testing and dispatch extension team for corrective dosage planning."
    };
  }

  return {
    sms: `FarmPulse Update: ${farm.village} ${farm.crop_type} remains healthy. Continue current schedule and monitor weekly.`,
    officer: "No immediate escalation needed. Keep the farm under routine satellite observation."
  };
}
