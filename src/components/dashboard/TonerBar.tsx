interface TonerBarProps {
  color: "black" | "cyan" | "magenta" | "yellow";
  level: number;
  compact?: boolean;
}

const colorMap = {
  black: { bg: "bg-toner-black", label: "K" },
  cyan: { bg: "bg-toner-cyan", label: "C" },
  magenta: { bg: "bg-toner-magenta", label: "M" },
  yellow: { bg: "bg-toner-yellow", label: "Y" },
};

export default function TonerBar({ color, level, compact = false }: TonerBarProps) {
  const { bg, label } = colorMap[color];
  const isCritical = level <= 10;

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "min-w-[120px]"}`}>
      <span className={`text-xs font-bold w-4 text-center ${isCritical ? "text-destructive animate-pulse-glow" : "text-muted-foreground"}`}>
        {label}
      </span>
      <div className={`flex-1 ${compact ? "h-2" : "h-3"} rounded-full bg-secondary overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${bg} ${isCritical ? "animate-pulse-glow" : ""}`}
          style={{ width: `${level}%` }}
        />
      </div>
      <span className={`text-xs font-medium w-8 text-right ${isCritical ? "text-destructive" : "text-muted-foreground"}`}>
        {level}%
      </span>
    </div>
  );
}
