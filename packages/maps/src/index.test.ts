import { expect, test } from 'bun:test';

import { districtMap, hasDistrictMap, provinces, provincesSmall } from './index';

test('provinces holds all 77 provinces with names and a path', () => {
  expect(provinces.shapes).toHaveLength(77);
  expect(provinces.shapes.find((s) => s.code === '84')).toMatchObject({
    name_th: 'สุราษฎร์ธานี',
    name_en: 'Surat Thani',
  });
  expect(provinces.shapes.every((s) => /^M\d/.test(s.d))).toBe(true);
  expect(provinces.borders.length).toBeGreaterThan(0);
});

test('districtMap loads the districts of one province', async () => {
  const surat = await districtMap('84');
  expect(surat.shapes).toHaveLength(19);
  expect(surat.shapes.every((s) => s.code.startsWith('84'))).toBe(true);
  expect(hasDistrictMap('84')).toBe(true);
  expect(hasDistrictMap('99')).toBe(false);
  expect(districtMap('99')).rejects.toThrow('no district map for province "99"');
});

test('provincesSmall is the same map at a fifth of the size', () => {
  expect(provincesSmall.shapes).toHaveLength(77);
  expect(provincesSmall.width).toBe(200);
  const expected = (provinces.height / provinces.width) * 200;
  expect(Math.abs(provincesSmall.height - expected) / expected).toBeLessThan(0.01);
});
