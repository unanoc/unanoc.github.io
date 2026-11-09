import { cn } from "@/lib/cn";
import type { CountryInfo } from "@/lib/travel";
import { Flag } from "@/components/ui/Flag";

type Props = {
  countries: CountryInfo[];
  selected?: string;
  onSelect: (code: string | undefined) => void;
};

export function FlagRow({ countries, selected, onSelect }: Props) {
  return (
    <ul className="flex flex-wrap gap-2">
      {countries.map((c) => {
        const active = c.code === selected;

        return (
          <li key={c.code}>
            <button
              onClick={() => onSelect(active ? undefined : c.code)}
              aria-pressed={active}
              aria-label={c.name}
              title={c.name}
              className={cn(
                "grid size-11 place-items-center rounded-xl transition",
                active ? "bg-elevated ring-1 ring-accent" : "hover:bg-elevated",
                selected && !active && "opacity-40 hover:opacity-100",
              )}
            >
              <Flag code={c.code} className="text-[28px]" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
