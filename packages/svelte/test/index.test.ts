import { afterAll, expect, test } from 'bun:test';
import { rm } from 'node:fs/promises';

import { districtMap, provinces, render as model, toSvg } from '@geothai/maps';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';

// bun test cannot import a .svelte file, so the test compiles it for the server first.
const source = await Bun.file(new URL('../src/lib/GeoThaiMap.svelte', import.meta.url)).text();
const { js } = compile(source, { generate: 'server', filename: 'GeoThaiMap.svelte' });
const compiled = new URL('./.GeoThaiMap.server.js', import.meta.url);
await Bun.write(compiled, js.code);
const { default: GeoThaiMap } = await import(compiled.href);
afterAll(() => rm(compiled, { force: true }));

// Svelte marks blocks with comments for hydration. They are not part of the map.
const html = (props: Record<string, unknown>) =>
  render(GeoThaiMap, { props }).body.replaceAll(/<!--[^>]*-->/g, '');

test('the Svelte map has exactly the markup of toSvg()', async () => {
  const options = {
    title: 'Thailand & islands',
    href: (s: { code: string }) => `/provinces/${s.code}/?a=1&b=2`,
    fills: { 84: '#0f1115' },
    highlight: ['84'],
    labels: (s: { name_en: string }) => s.name_en,
  };
  expect(html({ map: provinces, ...options })).toBe(toSvg(model(provinces, options)));
  const surat = await districtMap('84');
  expect(html({ map: surat })).toBe(toSvg(model(surat)));
});
