"use client";

import { geoNaturalEarth1, geoPath } from "d3-geo";
import type { Feature, Geometry } from "geojson";
import countries from "i18n-iso-countries";
import { useEffect, useMemo, useState } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";

/** Totals from GET /api/downloads. */
type Stats = { enabled: boolean; total: number; countries: Record<string, number> };

const WIDTH = 960;
const HEIGHT = 470;

/** Fill shades for countries, from no downloads to the most. */
const SHADES = [
  "fill-zinc-200 dark:fill-zinc-800",
  "fill-indigo-200 dark:fill-indigo-900",
  "fill-indigo-300 dark:fill-indigo-700",
  "fill-indigo-500 dark:fill-indigo-500",
  "fill-indigo-700 dark:fill-indigo-300",
];

/**
 * Picks a shade for a country, relative to the country with the most downloads (log scale, so one big country
 * doesn't wash out the rest).
 * @param {number} count Downloads in this country.
 * @param {number} max Downloads in the top country.
 * @returns {number} Shade index 0–4.
 */
function shadeFor(count: number, max: number): number {
  if (count <= 0 || max <= 0) return 0;
  return Math.min(4, 1 + Math.floor((Math.log(count + 1) / Math.log(max + 1)) * 3.999));
}

/**
 * World map of Ladderly downloads by country, with the total and the top countries. Country shapes come from
 * Natural Earth (world-atlas, bundled), drawn as SVG with d3-geo; totals come from /api/downloads.
 * @returns {JSX.Element} The map section content.
 */
export function DownloadMap() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/downloads")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((s: Stats) => !cancelled && setStats(s))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  // Country outlines, projected once.
  const shapes = useMemo(() => {
    const topology = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
    const collection = feature(topology, topology.objects.countries);
    const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], collection);
    const path = geoPath(projection);
    return collection.features.map((f: Feature<Geometry, { name: string }>) => ({
      id: String(f.id ?? ""),
      name: f.properties.name,
      d: path(f) ?? "",
    }));
  }, []);

  const names = useMemo(() => new Intl.DisplayNames(["en"], { type: "region" }), []);
  const byNumeric = useMemo(() => {
    const map = new Map<string, number>();
    for (const [code, count] of Object.entries(stats?.countries ?? {})) {
      const numeric = countries.alpha2ToNumeric(code);
      if (numeric) map.set(numeric, (map.get(numeric) ?? 0) + count);
    }
    return map;
  }, [stats]);

  const ranked = Object.entries(stats?.countries ?? {})
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  const max = ranked[0]?.[1] ?? 0;
  const countryCount = ranked.filter(([c]) => c !== "XX").length;

  /**
   * A country's display name.
   * @param {string} code Two-letter code.
   * @returns {string} e.g. "India", or "Somewhere on Earth" for unknown.
   */
  const nameOf = (code: string) => (code === "XX" ? "Somewhere on Earth" : (names.of(code) ?? code));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-center gap-x-10 gap-y-2 text-center">
        <Stat value={stats?.enabled ? stats.total.toLocaleString() : "–"} label="downloads" />
        <Stat value={stats?.enabled ? countryCount.toLocaleString() : "–"} label={countryCount === 1 ? "country" : "countries"} />
      </div>

      <div className="relative mt-6">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="img" aria-label={stats?.enabled ? `Map of downloads: ${countryCount} countries` : "World map"}>
          {shapes.map((s) => {
            const count = byNumeric.get(s.id) ?? 0;
            return (
              <path key={s.id + s.name} d={s.d} className={`${SHADES[shadeFor(count, max)]} stroke-white stroke-[0.5] transition-colors dark:stroke-zinc-950`}>
                <title>{count ? `${s.name}: ${count.toLocaleString()} download${count === 1 ? "" : "s"}` : s.name}</title>
              </path>
            );
          })}
        </svg>
        {(failed || (stats && !stats.enabled)) && (
          <p className="absolute inset-x-0 top-1/2 mx-auto w-fit -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-sm text-zinc-600 shadow-sm dark:bg-zinc-900/90 dark:text-zinc-300">
            Download counts will appear here soon.
          </p>
        )}
        {stats?.enabled && stats.total === 0 && (
          <p className="absolute inset-x-0 top-1/2 mx-auto w-fit -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-sm text-zinc-600 shadow-sm dark:bg-zinc-900/90 dark:text-zinc-300">
            Be the first to put your country on the map ✨
          </p>
        )}
      </div>

      {ranked.length > 0 && (
        <ol className="mx-auto mt-6 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
          {ranked.slice(0, 9).map(([code, n], i) => (
            <li key={code} className="flex items-center gap-2">
              <span className="w-4 text-right text-xs tabular-nums text-zinc-400">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate">{nameOf(code)}</span>
              <span className="tabular-nums text-zinc-500">{n.toLocaleString()}</span>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-6 text-center text-xs text-zinc-500">
        Counted once per browser, by country only. No IP addresses or personal details are stored.
      </p>
    </div>
  );
}

/**
 * One big number with a label.
 * @param {Object} props
 * @param {string} props.value The number, formatted.
 * @param {string} props.label What it counts.
 * @returns {JSX.Element} The stat.
 */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <p>
      <span className="block text-4xl font-bold tabular-nums tracking-tight">{value}</span>
      <span className="text-sm text-zinc-500">{label}</span>
    </p>
  );
}
