import type { MapShapes, NameMatch } from './types';

/** Words people put before a name, and the marks that English names differ by. */
const PREFIX = /^(?:จังหวัด|อำเภอ|เขต|ตำบล|แขวง|กิ่งอำเภอ)/;
const SHORT = /^\s*(?:จ|อ|ต)\.\s*/;
const MARKS = /[\s.'-]/g;

/** Short forms of province names that people type. A code wins only if the map has it. */
const ALIASES: Record<string, string> = { กทม: '10', กรุงเทพ: '10', อยุธยา: '14', ayutthaya: '14' };

const normalize = (text: string) =>
  text.replace(SHORT, '').toLowerCase().replaceAll(MARKS, '').replace(PREFIX, '');

/**
 * Turns names as people write them into area codes of one map.
 *
 * A name matches after lower case, and without spaces, dots, apostrophes, hyphens and a leading
 * word such as "จังหวัด" or the short "จ.". A name that is already a code of the map passes
 * through. "เมือง" or "Mueang" matches the capital district (code XX01). Names that
 * match nothing, or that match more than one area, come back in `unmatched`.
 *
 * @param inputs - The names, in Thai or English, or codes.
 * @param map - The map that says which codes exist and what they are called.
 * @returns A code for every name it could place, and the names it could not.
 * @example
 * fromNames(['จ.สุราษฎร์ธานี', 'Surat Thani', 'โคราช'], provinces);
 * // { found: { 'จ.สุราษฎร์ธานี': '84', 'Surat Thani': '84' }, unmatched: ['โคราช'] }
 */
export function fromNames(inputs: Iterable<string>, map: MapShapes): NameMatch {
  const byName = new Map<string, string[]>();
  const byCode = new Set(map.shapes.map((s) => s.code));
  for (const s of map.shapes) {
    for (const key of new Set([normalize(s.name_th), normalize(s.name_en)])) {
      byName.set(key, [...(byName.get(key) ?? []), s.code]);
    }
  }
  // The capital district is always XX01. Bangkok has none.
  const mueang = map.shapes
    .filter((s) => s.code.length === 4 && s.code.endsWith('01') && !s.code.startsWith('10'))
    .map((s) => s.code);

  const found: Record<string, string> = {};
  const unmatched: string[] = [];
  for (const input of new Set(inputs)) {
    const name = normalize(input);
    let code: string | undefined;
    if (byCode.has(input)) code = input;
    else if (name === 'เมือง' || name === 'mueang')
      code = mueang.length === 1 ? mueang[0] : undefined;
    else if (byName.get(name)?.length === 1) code = byName.get(name)?.[0];
    else if (ALIASES[name] && byCode.has(ALIASES[name])) code = ALIASES[name];
    if (code) found[input] = code;
    else unmatched.push(input);
  }
  return { found, unmatched };
}
