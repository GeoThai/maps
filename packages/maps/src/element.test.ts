import { expect, test } from 'bun:test';

import { GeoThaiMap } from './element';

test('importing the module defines <geothai-map>', () => {
  expect(customElements.get('geothai-map')).toBe(GeoThaiMap);
});

test('a geothai-map draws the areas of Thailand', async () => {
  document.body.innerHTML = '<geothai-map title="Thailand"></geothai-map>';
  const el = document.body.querySelector('geothai-map');
  await new Promise((r) => setTimeout(r, 20));
  const svg = el?.querySelector('svg');
  expect(svg?.getAttribute('viewBox')).toBe('0 0 1000 1875');
  expect(svg?.querySelectorAll('path[fill="#eef1f4"]')).toHaveLength(77);
  expect(svg?.querySelector('title')?.textContent).toBe('Thailand');
});

test('a geothai-map can show the districts of one province', async () => {
  document.body.innerHTML = '<geothai-map level="district" province="84"></geothai-map>';
  const el = document.body.querySelector('geothai-map');
  await new Promise((r) => setTimeout(r, 20));
  expect(el?.querySelectorAll('path[fill="#eef1f4"]')).toHaveLength(19);
});

test('a geothai-map reports an unknown province instead of throwing', async () => {
  document.body.innerHTML = '<geothai-map level="district" province="99"></geothai-map>';
  const el = document.body.querySelector('geothai-map');
  await new Promise((r) => setTimeout(r, 20));
  expect(el?.querySelector('p')?.textContent).toContain('no district map');
});

test('a geothai-map links each area with the href template', async () => {
  document.body.innerHTML = '<geothai-map href="/provinces/{code}/"></geothai-map>';
  await new Promise((r) => setTimeout(r, 20));
  const link = document.body.querySelector('a');
  expect(link?.namespaceURI).toBe('http://www.w3.org/2000/svg');
  expect(link?.getAttribute('href')).toBe('/provinces/10/');
});
