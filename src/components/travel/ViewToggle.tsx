import { Globe2, Map } from "lucide-react";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";

export type TravelView = "globe" | "map";

export function ViewToggle({
  value,
  onChange,
}: {
  value: TravelView;
  onChange: (view: TravelView) => void;
}) {
  const { m } = useI18n();
  const options = [
    { id: "globe" as const, label: m.travel.globeView, Icon: Globe2 },
    { id: "map" as const, label: m.travel.mapView, Icon: Map },
  ];

  return (
    <span role="group" className="inline-flex rounded-full bg-elevated p-0.5">
      {options.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          aria-pressed={value === id}
          aria-label={label}
          title={label}
          className={cn(
            "grid size-7 place-items-center rounded-full transition",
            value === id
              ? "bg-bg text-ink shadow-sm"
              : "text-faint hover:text-ink",
          )}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </span>
  );
}
