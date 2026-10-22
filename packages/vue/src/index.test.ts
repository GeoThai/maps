import { expect, test } from 'bun:test';

import { districtMap, provinces, render, toSvg } from '@geothai/maps';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';

import { GeoThaiMap } from './index';

const html = async (props: Record<string, unknown>) =>
  // Vue writes ' as &#39;, toSvg() as &#x27;: the same character.
  (await renderToString(createSSRApp({ render: () => h(GeoThaiMap, props as never) }))).replaceAll(
    '&#39;',
    '&#x27;',
  );

test('the Vue map has exactly the markup of toSvg()', async () => {
  const options = {
    title: 'Thailand & islands',
    href: (s: { code: string }) => `/provinces/${s.code}/?a=1&b=2`,
    fills: { 84: '#0f1115' },
    highlight: ['84'],
    labels: (s: { name_en: string }) => s.name_en,
  };
  expect(await html({ map: provinces, ...options })).toBe(toSvg(render(provinces, options)));
  const surat = await districtMap('84');
  expect(await html({ map: surat })).toBe(toSvg(render(surat)));
});
