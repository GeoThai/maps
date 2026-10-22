import { expect, test } from 'bun:test';

import { fromNames } from './names';
import ayutthaya from './shapes/districts/14';
import korat from './shapes/districts/30';
import surat from './shapes/districts/84';
import provinces from './shapes/provinces';
import type { MapShapes } from './types';

const tiny: MapShapes = {
  width: 10,
  height: 10,
  shapes: [
    { code: '10', name_th: 'กรุงเทพมหานคร', name_en: 'Bangkok', d: 'M0 0' },
    { code: '84', name_th: 'สุราษฎร์ธานี', name_en: 'Surat Thani', d: 'M1 0' },
    { code: '14', name_th: 'พระนครศรีอยุธยา', name_en: 'Phra Nakhon Si Ayutthaya', d: 'M2 0' },
  ],
  borders: '',
  outline: '',
};

test('fromNames reads the forms people write', () => {
  expect(fromNames(['จ.สุราษฎร์ธานี', 'Surat Thani', 'surat thani'], provinces).found).toEqual({
    'จ.สุราษฎร์ธานี': '84',
    'Surat Thani': '84',
    'surat thani': '84',
  });
});

test('fromNames passes codes through and reads short aliases', () => {
  expect(fromNames(['84', 'กทม', 'อยุธยา'], tiny).found).toEqual({
    84: '84',
    กทม: '10',
    อยุธยา: '14',
  });
});

test('fromNames reads เมือง as the capital district', () => {
  expect(Object.values(fromNames(['อ.เมือง', 'Mueang'], surat).found)).toEqual(['8401', '8401']);
  expect(fromNames(['เมือง', 'เมืองยาง'], korat).found).toEqual({ เมือง: '3001', เมืองยาง: '3027' });
  expect(fromNames(['อ.เมือง'], ayutthaya).found).toEqual({ 'อ.เมือง': '1401' });
  expect(fromNames(['เมือง'], provinces).unmatched).toEqual(['เมือง']);
});

test('fromNames leaves what it cannot place', () => {
  const { found, unmatched } = fromNames(['โคราช', 'พะงัน', 'บ้านใต้'], provinces);
  expect(found).toEqual({});
  expect(unmatched).toEqual(['โคราช', 'พะงัน', 'บ้านใต้']);
});

test('fromNames reports a name that fits two areas as unmatched', () => {
  const two: MapShapes = {
    ...tiny,
    shapes: [
      ...tiny.shapes,
      { code: '15', name_th: 'สุราษฎร์บุรี', name_en: 'Surat Thani', d: 'M3 0' },
    ],
  };
  const { found, unmatched } = fromNames(['Surat Thani'], two);
  expect(found).toEqual({});
  expect(unmatched).toEqual(['Surat Thani']);
});
