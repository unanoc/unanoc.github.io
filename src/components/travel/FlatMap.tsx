import { geoNaturalEarth1, geoPath } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import type { GlobeMarker } from "./Globe";
import type { LandDots } from "./landDots";
import { coarseUrl, loadWorld, type World } from "./world";

type Props = {
  label: string;
  visited: Set<string>;
  selected?: string;
  markers: GlobeMarker[];
  onCountryClick: (numericId: string) => void;
};

const WIDTH = 1000;
const ANTARCTICA_ID = "010";
const MIN_DOT_LAT = -58;
const DOT_RADIUS = 1.7;

function dotsPath(
  dots: LandDots,
  project: (p: [number, number]) => [number, number] | null,
) {
  const parts: string[] = [];
  for (let i = 0; i < dots.count; i++) {
    if (dots.lat[i] < MIN_DOT_LAT) continue;
    const p = project([dots.lng[i], dots.lat[i]]);
    if (!p) continue;
    parts.push(
      `M${(p[0] - DOT_RADIUS).toFixed(1)} ${p[1].toFixed(1)}a${DOT_RADIUS} ${DOT_RADIUS} 0 1 0 ${DOT_RADIUS * 2} 0a${DOT_RADIUS} ${DOT_RADIUS} 0 1 0 ${-DOT_RADIUS * 2} 0`,
    );
  }

  return parts.join("");
}

function layout(world: World) {
  const land: FeatureCollection = {
    type: "FeatureCollection",
    features: world.countries.filter((f) => String(f.id) !== ANTARCTICA_ID),
  };
  const projection = geoNaturalEarth1().fitWidth(WIDTH, land);
  const path = geoPath(projection);
  const [[, top], [, bottom]] = path.bounds(land);

  return {
    projection,
    height: Math.ceil(bottom - top),
    top: Math.floor(top),
    countries: land.features.map((f: Feature) => ({
      id: String(f.id),
      d: path(f) ?? "",
    })),
    dots: dotsPath(world.dots, (p) => projection(p)),
  };
}

export function FlatMap({
  label,
  visited,
  selected,
  markers,
  onCountryClick,
}: Props) {
  const [world, setWorld] = useState<World | null>(null);

  useEffect(() => {
    let alive = true;
    loadWorld(coarseUrl).then((w) => alive && setWorld(w));

    return () => {
      alive = false;
    };
  }, []);

  const map = useMemo(() => (world ? layout(world) : null), [world]);

  if (!map)
    return (
      <div className="aspect-[2/1] w-full animate-pulse rounded-2xl bg-elevated" />
    );

  const active = markers.filter((m) => m.active);
  const visitedCountries = map.countries.filter((c) => visited.has(c.id));

  return (
    <svg
      viewBox={`0 ${map.top} ${WIDTH} ${map.height}`}
      role="img"
      aria-label={label}
      className="block h-auto w-full select-none"
    >
      <path d={map.dots} fill="var(--globe-dot)" opacity={0.7} />
      {visitedCountries.map((c) => (
        <path key={`${c.id}-base`} d={c.d} fill="var(--bg)" />
      ))}
      {visitedCountries.map((c) => (
        <path
          key={c.id}
          d={c.d}
          onClick={() => onCountryClick(c.id)}
          fill={c.id === selected ? "var(--accent)" : "var(--globe-visited)"}
          stroke="var(--bg)"
          strokeWidth={0.6}
          className={cn(
            "cursor-pointer transition-opacity hover:opacity-80",
            selected && c.id !== selected && "opacity-40",
          )}
        />
      ))}
      {active.map((m) => {
        const p = map.projection([m.lng, m.lat]);
        if (!p) return null;

        return (
          <circle
            key={m.id}
            cx={p[0]}
            cy={p[1]}
            r={3.2}
            fill="var(--accent)"
            stroke="var(--globe-core)"
            strokeWidth={1.4}
          />
        );
      })}
    </svg>
  );
}
