import { loaders as districtLoaders } from './shapes/districts';
import { loaders as subdistrictLoaders } from './shapes/subdistricts';
import type { MapShapes } from './types';

export { choropleth } from './colors';
export { fromNames } from './names';
export { render, toSvg } from './render';
export { default as provinces } from './shapes/provinces';
export { default as provincesSmall } from './shapes/provinces-small';

/**
 * True if there is a district map for this province code.
 *
 * @param code - Two-digit DOPA province code.
 * @returns `true` for all 77 provinces.
 * @example
 * hasDistrictMap('84'); // true
 */
export function hasDistrictMap(code: string): boolean {
  return code in districtLoaders;
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
  const load = districtLoaders[code];
  if (!load) throw new Error(`@geothai/maps: no district map for province "${code}"`);
  return (await load()).default;
}

/**
 * True if there is a subdistrict map for this district code.
 *
 * @param code - Four-digit DOPA district code.
 * @returns `true` for all 928 districts.
 * @example
 * hasSubdistrictMap('8405'); // true
 */
export function hasSubdistrictMap(code: string): boolean {
  return code in subdistrictLoaders;
}

/**
 * Loads the subdistrict map of one district. Each district is its own module.
 *
 * @param code - Four-digit DOPA district code, such as `'8405'`.
 * @returns The map of its subdistricts, with the district filling the width.
 * @throws When no district has this code.
 * @example
 * (await subdistrictMap('8405')).shapes.length; // 3
 */
export async function subdistrictMap(code: string): Promise<MapShapes> {
  const load = subdistrictLoaders[code];
  if (!load) throw new Error(`@geothai/maps: no subdistrict map for district "${code}"`);
  return (await load()).default;
}
