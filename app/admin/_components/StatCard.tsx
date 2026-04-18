type Props = {
  label: string;
  value: string;
  sub?: string;
  trend?: { val: string; up: boolean };
  icon: React.ReactNode;
  /** tailwind bg + text classes for icon wrapper, e.g. "bg-violet-50 text-violet-600" */
  iconColors?: string;
};

export default function StatCard({ label, value, sub, trend, icon, iconColors }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColors ?? "bg-zinc-100 text-zinc-600"}`}>
          {icon}
        </div>
        {trend && (
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              trend.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
            }`}
          >
            {trend.up ? "↑" : "↓"} {trend.val}
          </span>
        )}
      </div>

      <div>
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mb-1">
          {label}
        </p>
        <p
          className="text-2xl font-bold text-zinc-900"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {value}
        </p>
        {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
