import { exactly, isDigit, takeAll, skipAll, parseNumber,  makeSymbolResult } from './parser';
import { SepVal, StringVal } from './types'

test('skipAll test', () => {
  expect(skipAll('abcde', 'a')).toBe('bcde');
  expect(skipAll('    bcde', ' ')).toBe('bcde');
});

test('takeAll test', () => {
  expect(takeAll(c => c === 'a')('abcd')).toEqual(makeSymbolResult<StringVal>({
    valType: 'string',
    value: 'a',
  }, 'bcd'));

  expect(takeAll(isDigit)('12344  abcd')).toEqual(makeSymbolResult<StringVal>({
    valType: 'string',
    value: '12344',
  }, '  abcd'));

  expect(takeAll(isDigit)('a12344  abcd')).toEqual(makeSymbolResult<StringVal>({
    valType: 'string',
    value: '',
  },  'a12344  abcd'));
})

test('parse number test', () => {
  expect(parseNumber('123')).toEqual([null, {
    valType: 'number',
    value: 123
  }, ''])
});

test('exactly test', () => {
  expect(exactly('"')('"abc')).toEqual(makeSymbolResult<SepVal>({
    valType: 'sep',
    value: '"',
  }, 'abc'))

  expect(exactly('"')('a"abc')[0]).toBeTruthy()
  expect(exactly('abc')('abc1a"abc')).toEqual(makeSymbolResult<SepVal>({
    valType: 'sep',
    value: 'abc',
  }, '1a"abc'))
})
