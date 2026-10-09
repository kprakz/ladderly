"use client";

import { geoCentroid, geoNaturalEarth1, geoPath } from "d3-geo";
import type { Feature, Geometry } from "geojson";
import countries from "i18n-iso-countries";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";

/** Totals from GET /api/downloads. */
type Stats = { enabled: boolean; total: number; countries: Record<string, number> };

/** Grid size: one square per cell, like GitHub's contribution graph. */
const COLS = 120;
const ROWS = 56;
/** Square size and gap, in SVG units. */
const CELL = 8;
const GAP = 1.6;
/** Rasterise at this many pixels per cell, then sample each cell's centre. */
const SAMPLE = 4;

/** Square colours, from no downloads to the most: the same indigo scale as the activity heatmap. */
const SHADES = [
  "fill-zinc-200 dark:fill-zinc-800",
  "fill-indigo-200 dark:fill-indigo-900",
  "fill-indigo-400 dark:fill-indigo-700",
  "fill-indigo-600 dark:fill-indigo-500",
  "fill-indigo-800 dark:fill-indigo-300",
];

/**
 * One land square: its grid position and the countries (ISO numeric ids) on it. Usually one; a tiny country too
 * small for a square of its own shares the square at its centre with its neighbour.
 */
type Cell = { col: number; row: number; ids: string[] };
/** The land grid plus, per country, the cell nearest its centre (where its colour spreads from). */
type Grid = { cells: Cell[]; centres: Map<string, { col: number; row: number }> };

/**
 * Small countries and territories missing from the low-detail world map, as [longitude, latitude], so their
 * downloads still light up a square.
 */
const SMALL_PLACES: Record<string, [number, number]> = {
  SG: [103.82, 1.35], HK: [114.17, 22.32], MO: [113.54, 22.2], BH: [50.55, 26.07], MT: [14.38, 35.94], MV: [73.22, 3.2],
  MU: [57.55, -20.35], SC: [55.49, -4.68], AD: [1.52, 42.51], MC: [7.42, 43.74], LI: [9.55, 47.17], SM: [12.46, 43.94],
  BB: [-59.54, 13.19], CV: [-23.6, 15.12], KM: [43.87, -11.88], ST: [6.61, 0.19], TO: [-175.2, -21.18], WS: [-172.1, -13.76],
};

let gridCache: Grid | null = null;

/**
 * Builds the square-grid world once: draws each country in its own colour on a small hidden canvas, then reads the
 * colour at each cell's centre to know which country (if any) the cell belongs to. Antialiased edge pixels have
 * blended colours that match no country, so they're simply left as sea. Tiny countries that get no cell are given
 * one at their centre, and places missing from the map entirely get one from `SMALL_PLACES`, so they can still light up.
 * @returns {Grid} The grid (cached after the first call).
 */
function buildGrid(): Grid {
  if (gridCache) return gridCache;
  const topology = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
  const shapes = feature(topology, topology.objects.countries).features as Feature<Geometry, { name: string }>[];
  const w = COLS * SAMPLE;
  const h = ROWS * SAMPLE;
  const projection = geoNaturalEarth1().fitSize([w, h], { type: "FeatureCollection", features: shapes });
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const cells: Cell[] = [];
  const centres = new Map<string, { col: number; row: number }>();
  if (!ctx) return (gridCache = { cells, centres });

  const path = geoPath(projection, ctx);
  const byColour = new Map<number, string>();
  shapes.forEach((f, i) => {
    if (f.id === undefined) return;
    const n = i + 1;
    const colour = (n * 47) % 256 | (((n * 13) % 256) << 8) | (((n * 89) % 256) << 16);
    byColour.set(colour, String(f.id));
    ctx.fillStyle = `rgb(${colour & 255}, ${(colour >> 8) & 255}, ${(colour >> 16) & 255})`;
    ctx.beginPath();
    path(f);
    ctx.fill();
  });

  const pixels = ctx.getImageData(0, 0, w, h).data;
  const seen = new Set<string>();
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = col * SAMPLE + SAMPLE / 2;
      const y = row * SAMPLE + SAMPLE / 2;
      const o = (y * w + x) * 4;
      if (pixels[o + 3] < 250) continue;
      const id = byColour.get(pixels[o] | (pixels[o + 1] << 8) | (pixels[o + 2] << 16));
      if (!id) continue;
      cells.push({ col, row, ids: [id] });
      seen.add(id);
    }
  }

  for (const f of shapes) {
    if (f.id === undefined) continue;
    const id = String(f.id);
    const p = projection(geoCentroid(f));
    if (!p) continue;
    const col = Math.min(COLS - 1, Math.max(0, Math.floor(p[0] / SAMPLE)));
    const row = Math.min(ROWS - 1, Math.max(0, Math.floor(p[1] / SAMPLE)));
    centres.set(id, { col, row });
    if (seen.has(id)) continue;
    const shared = cells.find((c) => c.col === col && c.row === row);
    if (shared) shared.ids.push(id);
    else cells.push({ col, row, ids: [id] });
    seen.add(id);
  }

  for (const [code, lonLat] of Object.entries(SMALL_PLACES)) {
    const id = countries.alpha2ToNumeric(code);
    const p = projection(lonLat);
    if (!id || seen.has(id) || !p) continue;
    const col = Math.min(COLS - 1, Math.max(0, Math.floor(p[0] / SAMPLE)));
    const row = Math.min(ROWS - 1, Math.max(0, Math.floor(p[1] / SAMPLE)));
    centres.set(id, { col, row });
    const shared = cells.find((c) => c.col === col && c.row === row);
    if (shared) shared.ids.push(id);
    else cells.push({ col, row, ids: [id] });
    seen.add(id);
  }
  return (gridCache = { cells, centres });
}

/** The grid never changes once built, so there's nothing to subscribe to. */
const noSubscribe = () => () => {};
/** Server render: no grid (it needs a canvas); the browser builds it on hydration. */
const noGrid = () => null;

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
 * World map of Ladderly downloads drawn as GitHub-style squares: land is a grid of small rounded squares, and
 * countries with downloads are shaded from light (few) to dark (many) in Ladderly's indigo. When the map scrolls
 * into view, each country's colour spreads outward from its centre, starting with the country with the most
 * downloads. Totals come from /api/downloads; hovering a square shows the country and its count.
 * @returns {JSX.Element} The map section content.
 */
export function DownloadMap() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const grid = useSyncExternalStore(noSubscribe, buildGrid, noGrid);

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

  // Start the spreading animation when the map comes into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const names = useMemo(() => new Intl.DisplayNames(["en"], { type: "region" }), []);

  // Downloads per country, keyed by the map's numeric ids, ranked so the busiest country spreads first.
  const { byNumeric, rank, max, countryCount } = useMemo(() => {
    const counts = new Map<string, { count: number; code: string }>();
    for (const [code, count] of Object.entries(stats?.countries ?? {})) {
      const numeric = countries.alpha2ToNumeric(code);
      if (numeric && count > 0) counts.set(numeric, { count: (counts.get(numeric)?.count ?? 0) + count, code });
    }
    const order = [...counts.entries()].sort((a, b) => b[1].count - a[1].count).map(([id]) => id);
    return {
      byNumeric: counts,
      rank: new Map(order.map((id, i) => [id, i])),
      max: Math.max(0, ...[...counts.values()].map((c) => c.count)),
      countryCount: counts.size,
    };
  }, [stats]);

  return (
    <div>
      {stats?.enabled && stats.total > 0 && (
        <p className="text-center text-sm text-zinc-500">
          <strong className="text-zinc-900 dark:text-zinc-100">{stats.total.toLocaleString()}</strong> downloads in{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">{countryCount.toLocaleString()}</strong>{" "}
          {countryCount === 1 ? "country" : "countries"}
        </p>
      )}

      <div ref={ref} className={`relative mt-6 ${started ? "map-started" : ""}`}>
        <svg
          viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
          className="h-auto w-full"
          role="img"
          aria-label={stats?.enabled ? `Map of Ladderly downloads in ${countryCount} countries` : "World map"}
        >
          {grid?.cells.map((c) => {
            // On a shared square, show the country with the most downloads.
            const id = c.ids.reduce((best, x) => ((byNumeric.get(x)?.count ?? 0) > (byNumeric.get(best)?.count ?? 0) ? x : best), c.ids[0]);
            const hit = byNumeric.get(id);
            const x = c.col * CELL;
            const y = c.row * CELL;
            const base = <rect key={`b${c.col}-${c.row}`} x={x} y={y} width={CELL - GAP} height={CELL - GAP} rx={1.6} className={SHADES[0]} />;
            if (!hit) return base;
            const centre = grid.centres.get(id) ?? c;
            const distance = Math.hypot(c.col - centre.col, c.row - centre.row);
            const delay = (rank.get(id) ?? 0) * 350 + distance * 70;
            return [
              base,
              <rect
                key={`d${c.col}-${c.row}`}
                x={x}
                y={y}
                width={CELL - GAP}
                height={CELL - GAP}
                rx={1.6}
                className={`map-spread ${SHADES[shadeFor(hit.count, max)]}`}
                style={{ animationDelay: `${Math.round(delay)}ms`, transformOrigin: `${x + CELL / 2}px ${y + CELL / 2}px` }}
              >
                <title>{`${names.of(hit.code) ?? hit.code}: ${hit.count.toLocaleString()} download${hit.count === 1 ? "" : "s"}`}</title>
              </rect>,
            ];
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

      <div className="mt-3 flex items-center justify-end gap-1 text-[11px] text-zinc-500" aria-hidden="true">
        Less
        {SHADES.map((s, i) => (
          <svg key={i} viewBox="0 0 10 10" className="h-3 w-3">
            <rect width="10" height="10" rx="2" className={s} />
          </svg>
        ))}
        More
      </div>
      <p className="mt-4 text-center text-xs text-zinc-500">
        Counted once per browser, by country only. No IP addresses or personal details are stored.
      </p>
    </div>
  );
}
