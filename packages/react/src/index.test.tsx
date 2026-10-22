import { expect, test } from 'bun:test';

import { districtMap, provinces, render, toSvg } from '@geothai/maps';
import { renderToStaticMarkup } from 'react-dom/server';

import { GeoThaiMap } from './index';

test('the React map has exactly the markup of toSvg()', async () => {
  const options = {
    title: 'Thailand & islands',
    href: (s: { code: string }) => `/provinces/${s.code}/?a=1&b=2`,
    fills: { 84: '#0f1115' },
    highlight: ['84'],
    labels: (s: { name_en: string }) => s.name_en,
  };
  expect(renderToStaticMarkup(<GeoThaiMap map={provinces} {...options} />)).toBe(
    toSvg(render(provinces, options)),
  );
  const surat = await districtMap('84');
  expect(renderToStaticMarkup(<GeoThaiMap map={surat} />)).toBe(toSvg(render(surat)));
});
