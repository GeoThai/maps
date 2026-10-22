import { loaders } from './shapes/districts';
import type { MapShapes } from './types';

export { render, toSvg } from './render';
export { default as provinces } from './shapes/provinces';

/**
 * True if there is a district map for this province code.
 *
 * @param code - Two-digit DOPA province code.
 * @returns `true` for all 77 provinces.
 * @example
 * hasDistrictMap('84'); // true
 */
export function hasDistrictMap(code: string): boolean {
  return code in loaders;
}

/**
 * Loads the district map of one province. Each province is its own module, so a page loads
 * only the map it shows.
 *
 * @param code - Two-digit DOPA province code, such as `'84'`.
 * @returns The map of its districts, with the province filling the width.
 * @throws When no province has this code.
 * @example
 * (await districtMap('84')).shapes.length; // 19
 */
export async function districtMap(code: string): Promise<MapShapes> {
  const load = loaders[code];
  if (!load) throw new Error(`@geothai/maps: no district map for province "${code}"`);
  return (await load()).default;
}
