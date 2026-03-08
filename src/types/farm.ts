export type FarmState = "Punjab" | "Haryana" | "Uttar Pradesh" | "Madhya Pradesh";
export type StressType = "healthy" | "water stress" | "heat stress" | "nutrient deficiency";

export type TrendPoint = {
  day: string;
  value: number;
};

export type DiagnosisPoint = {
  label: "Water Stress" | "Nutrient Deficiency" | "Pest Risk";
  value: number;
};

export type Farm = {
  id: string;
  village: string;
  state: FarmState;
  crop_type: string;
  farm_size: number;
  NDVI: number;
  NDWI: number;
  temperature: number;
  risk_score: number;
  stress_type: StressType;
  lat: number;
  lng: number;
  diagnosis: DiagnosisPoint[];
  ndviTrend: TrendPoint[];
  tempTrend: TrendPoint[];
};

export type KpiStat = {
  title: string;
  value: number;
  delta: number;
};
