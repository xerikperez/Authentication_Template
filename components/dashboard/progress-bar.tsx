interface ProgressBarProps {
  label: string;
  value: number;
  goal: number;
  unit?: string;
}

export const ProgressBar = ({ label, value, goal, unit }: ProgressBarProps) => {
  const percent = goal > 0 ? Math.min(100, Math.round((value / goal) * 100)) : 0;
  const formattedValue = `${Math.round(value)}${unit ? ` ${unit}` : ""}`;
  const formattedGoal = `${goal}${unit ? ` ${unit}` : ""}`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span className="font-medium">{label}</span>
        <span>
          {formattedValue} / {formattedGoal}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-amber-400 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-slate-500">{percent}% of goal</p>
    </div>
  );
};
