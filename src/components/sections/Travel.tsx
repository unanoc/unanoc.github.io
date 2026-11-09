import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { cities, type CityId } from "@/config";
import { useI18n } from "@/i18n/useI18n";
import { buildTravel } from "@/lib/travel";
import { CountryCities } from "@/components/travel/CountryCities";
import { FlatMap } from "@/components/travel/FlatMap";
import { FlagRow } from "@/components/travel/FlagRow";
import { TravelStat } from "@/components/travel/TravelStat";
import { ViewToggle, type TravelView } from "@/components/travel/ViewToggle";
import { focusOnCities, focusOnCity } from "@/components/travel/focus";
import {
  Globe,
  type GlobeFlag,
  type GlobeMarker,
} from "@/components/travel/Globe";
import { Section } from "@/components/ui/Section";

export function Travel() {
  const { locale, m, pick } = useI18n();
  const summary = useMemo(() => buildTravel(locale), [locale]);
  const [countryCode, setCountryCode] = useState<string>();
  const [cityId, setCityId] = useState<CityId>();
  const [view, setView] = useState<TravelView>("globe");

  const country = summary.countries.find((c) => c.code === countryCode);
  const visited = useMemo(
    () => new Set(summary.countries.map((c) => c.numericId)),
    [summary],
  );

  const focus = useMemo(() => {
    if (cityId) return focusOnCity(cities[cityId]);

    return country ? focusOnCities(country.cities.map((c) => c.city)) : null;
  }, [country, cityId]);

  const markers: GlobeMarker[] = useMemo(
    () =>
      summary.countries.flatMap((c) =>
        c.cities.map((s) => ({
          id: s.id,
          lat: s.city.lat,
          lng: s.city.lng,
          label: pick(s.city.name),
          active: c.code === countryCode && (!cityId || cityId === s.id),
        })),
      ),
    [summary, countryCode, cityId, pick],
  );

  const flags: GlobeFlag[] = useMemo(
    () =>
      summary.countries.map((c) => ({
        code: c.code,
        numericId: c.numericId,
        lat: c.cities.reduce((sum, s) => sum + s.city.lat, 0) / c.cities.length,
        lng: c.cities.reduce((sum, s) => sum + s.city.lng, 0) / c.cities.length,
      })),
    [summary],
  );

  function selectCountry(code: string | undefined) {
    setCityId(undefined);
    setCountryCode(code);
  }

  function selectByNumericId(numericId: string) {
    const hit = summary.countries.find((c) => c.numericId === numericId);
    if (hit) selectCountry(hit.code === countryCode ? undefined : hit.code);
  }

  const details = (
    <>
      <div className="mb-4 flex gap-8">
        <TravelStat n={summary.countries.length} forms={m.travel.countries} />
        <TravelStat n={summary.cityCount} forms={m.travel.cities} />
      </div>
      <FlagRow
        countries={summary.countries}
        selected={countryCode}
        onSelect={selectCountry}
      />
      <AnimatePresence mode="wait" initial={false}>
        {country && (
          <motion.div
            key={country.code}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="mt-5"
          >
            <CountryCities country={country} city={cityId} onCity={setCityId} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <Section
      title={m.travel.title}
      meta={<ViewToggle value={view} onChange={setView} />}
    >
      {view === "map" ? (
        <div className="space-y-6">
          <FlatMap
            label={m.travel.mapView}
            visited={visited}
            selected={country?.numericId}
            markers={markers}
            onCountryClick={selectByNumericId}
          />
          <div className="min-w-0">{details}</div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] md:gap-10">
          <div className="md:sticky md:top-6 md:self-start">
            <div className="mx-auto w-full max-w-[300px] md:max-w-[380px]">
              <Globe
                label={m.travel.globe}
                visited={visited}
                selected={country?.numericId}
                focus={focus}
                markers={markers}
                flags={flags}
                onCountryClick={selectByNumericId}
              />
            </div>
          </div>
          <div className="min-w-0">{details}</div>
        </div>
      )}
    </Section>
  );
}
