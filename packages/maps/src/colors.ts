import type { ColorOptions, Colors, LegendItem, MapShapes } from './types';

/** Colors from low to high, in the tones of the GeoThai design. */
export const DEFAULT_COLORS: readonly string[] = [
  '#eef1f4',
  '#c6cfd6',
  '#8f9ea9',
  '#4a5b68',
  '#0f1115',
];

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * The value at a fraction of a sorted list, between two items when it falls between them.
 *
 * @param sorted - The values, from low to high.
 * @param fraction - A number from 0 to 1.
 * @returns The value at that fraction.
 * @example
 * quantile([1, 2, 3, 4], 0.5); // 2.5
 */
function quantile(sorted: number[], fraction: number): number {
  const at = fraction * (sorted.length - 1);
  const low = sorted[Math.floor(at)] ?? 0;
  const high = sorted[Math.ceil(at)] ?? low;
  return low + (high - low) * (at - Math.floor(at));
}

/**
 * Turns values into one fill color per area code, and a legend that says what each color means.
 *
 * @param map - The map the values belong to. Codes that the map does not have are ignored.
 * @param values - A number per area code. `undefined` or `null` means no value.
 * @param options - See {@link ColorOptions}.
 * @returns One color per code that has a value, and the legend.
 * @example
 * choropleth(provinces, { 84: 10, 30: 5 }).fills['84']; // '#0f1115'
 */
export function choropleth(
  map: MapShapes,
  values: Record<string, number | null | undefined>,
  options: ColorOptions = {},
): Colors {
  const colors = options.colors ?? DEFAULT_COLORS;
  const count = colors.length;
  const entries = map.shapes.flatMap((s) => {
    const v = values[s.code];
    return typeof v === 'number' && Number.isFinite(v) ? [[s.code, v] as const] : [];
  });
  const numbers = entries.map(([, v]) => v).toSorted((a, b) => a - b);
  const min = numbers[0] ?? 0;
  const max = numbers.at(-1) ?? 0;

  const breaks = options.breaks ?? 'quantile';
  const steps = Array.from({ length: count - 1 }, (_, i) => (i + 1) / count);
  let cuts: number[];
  if (Array.isArray(breaks)) cuts = breaks.toSorted((a, b) => a - b);
  else if (breaks === 'equal') cuts = steps.map((f) => min + (max - min) * f);
  else cuts = steps.map((f) => quantile(numbers, f));

  const colorAt = (i: number) => colors[Math.min(i, count - 1)] ?? colors[0] ?? '';
  const colorOf = (n: number) => {
    const i = cuts.findIndex((cut) => n <= cut);
    return colorAt(i === -1 ? count - 1 : i);
  };
  const fills: Record<string, string> = Object.fromEntries(
    entries.map(([c, v]) => [c, colorOf(v)]),
  );
  const legend: LegendItem[] = colors.map((color, i) => ({
    color,
    from: i === 0 ? min : round(cuts[i - 1] ?? min),
    to: i === count - 1 ? max : round(cuts[i] ?? max),
  }));
  return { fills, legend };
}
