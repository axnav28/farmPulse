import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

type KpiCardProps = {
  title: string;
  value: number;
  delta: number;
  icon: LucideIcon;
  spark: { x: string; y: number }[];
  gradient: string;
};

export default function KpiCard({ title, value, delta, icon: Icon, spark, gradient }: KpiCardProps) {
  const positive = delta >= 0;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="panel relative overflow-hidden p-4"
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="relative z-10 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="rounded-lg border border-white/60 bg-white/70 p-2 text-cyan-700">
            <Icon className="h-4 w-4" />
          </span>
          <span className={`inline-flex items-center gap-1 text-[12px] font-semibold ${positive ? "text-emerald-700" : "text-rose-700"}`}>
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(delta)}%
          </span>
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</p>
        <h3 className="text-[34px] font-bold leading-none tabular-nums text-slate-900">{value.toLocaleString()}</h3>

        <div className="h-14">
          <ResponsiveContainer>
            <LineChart data={spark}>
              <Tooltip
                contentStyle={{
                  background: "rgba(248,250,252,0.95)",
                  border: "1px solid rgba(148,163,184,0.35)",
                  borderRadius: "10px",
                  fontSize: "12px"
                }}
              />
              <Line type="monotone" dataKey="y" stroke={positive ? "#0ea5e9" : "#f97316"} strokeWidth={2.2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.article>
  );
}
