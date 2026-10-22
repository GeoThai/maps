/**
 * Shortens an SVG path from d3-geo with whole-number coordinates: drops repeated points,
 * drops rings that collapse to under three points, and writes the points relative to the last.
 * d3-geo writes only M, L and Z commands, so this reads only those.
 */
export function compact(d: string): string {
  const out: string[] = [];
  for (const part of d.split(/(?=M)/)) {
    const closed = part.includes('Z');
    const points: [number, number][] = [];
    for (const [, x, y] of part.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)) {
      const p: [number, number] = [Math.round(Number(x)), Math.round(Number(y))];
      const last = points.at(-1);
      if (!last || last[0] !== p[0] || last[1] !== p[1]) points.push(p);
    }
    if (closed && points.length > 1) {
      const [first] = points;
      const last = points.at(-1);
      if (first && last && first[0] === last[0] && first[1] === last[1]) points.pop();
    }
    if (points.length < (closed ? 3 : 2)) continue;
    const [start, ...rest] = points;
    if (!start) continue;
    let [px, py] = start;
    const steps = rest.map(([x, y]) => {
      const step = `${x - px} ${y - py}`;
      px = x;
      py = y;
      return step;
    });
    out.push(`M${start[0]} ${start[1]}l${steps.join(' ')}${closed ? 'z' : ''}`);
  }
  return out.join('');
}
