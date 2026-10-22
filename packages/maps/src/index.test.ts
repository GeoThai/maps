import { expect, test } from 'bun:test';

import {
  districtMap,
  hasDistrictMap,
  hasSubdistrictMap,
  provinces,
  provincesSmall,
  subdistrictMap,
} from './index';

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

test('subdistrictMap loads the subdistricts of one district', async () => {
  const kopangan = await subdistrictMap('8405');
  expect(kopangan.shapes.map((s) => s.code)).toEqual(['840501', '840502', '840503']);
  expect(kopangan.shapes[2]).toMatchObject({ name_th: 'เกาะเต่า', name_en: 'Ko Tao' });
  expect(hasSubdistrictMap('8405')).toBe(true);
  expect(hasSubdistrictMap('84')).toBe(false);
  expect(subdistrictMap('9999')).rejects.toThrow('no subdistrict map for district "9999"');
});

test('a shape that covers several new khwaeng lists them all', async () => {
  const bangna = await subdistrictMap('1047');
  expect(bangna.shapes).toHaveLength(1);
  expect(bangna.shapes[0]).toMatchObject({
    code: '104702',
    codes: ['104702', '104703'],
    name_th: 'บางนาเหนือ / บางนาใต้',
  });
});
