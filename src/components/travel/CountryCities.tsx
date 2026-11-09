import { MapPin } from "lucide-react";
import type { CityId } from "@/config";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";
import type { CountryInfo } from "@/lib/travel";

type Props = {
  country: CountryInfo;
  city?: CityId;
  onCity: (id: CityId | undefined) => void;
};

export function CountryCities({ country, city, onCity }: Props) {
  const { m, pick, plural } = useI18n();

  return (
    <div>
      <p className="flex items-baseline gap-2">
        <span className="text-sm font-semibold text-ink">{country.name}</span>
        <span className="text-xs text-faint">
          {plural(country.cities.length, m.travel.cities)}
        </span>
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {country.cities.map((s) => {
          const active = city === s.id;

          return (
            <li key={s.id}>
              <button
                onClick={() => onCity(active ? undefined : s.id)}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[13px] font-medium transition",
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-line bg-surface text-ink hover:bg-elevated",
                )}
              >
                <MapPin
                  className={cn(
                    "size-3.5 shrink-0",
                    active ? "text-accent" : "text-faint",
                  )}
                />
                <span className="truncate">{pick(s.city.name)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
