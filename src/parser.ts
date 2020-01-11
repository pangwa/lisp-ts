import * as _ from 'lodash';
import { LispVal, ParseResult, NumberVal, SepVal, StringVal, TakeAllResult, } from './types'
import { ParsedUrlQuery } from 'querystring';

type ParserFn<T extends LispVal> = (s: string) => ParseResult<T>;

const digits: any = {
  0: true,
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
  8: true,
  9: true
};

export function isDigit(c: string): boolean {
  return !!digits[c];
}

export function skipAll(s: string, c: string): string {
  return _.trimStart(s, c);
}

function isBoundary(s: string): boolean {
  return _.isEmpty(s) || s[0] === ' ' || s[0] === ')';
}

export function exactly(str: string): ParserFn<SepVal> {
  return (s: string) => {
    if (!_.startsWith(s, str)) {
      return [`${str} expected, but got ${s}`, null, null]
    }
    return [null, {
      valType: 'sep',
      value: str,
    }, s.substr(str.length)]
  }
}

export function makeSymbolResult<ValType extends LispVal> (symbol: ValType, rest: string): ParseResult<ValType> {
  return [null, symbol, rest]
}

export function takeAll(pred: (c: string) => boolean): ParserFn<StringVal> {
  return (s: string) => {
    if (_.isEmpty(s)) {
      return makeSymbolResult({
        valType: 'string',
        value: '',
      }, '')
    }

    let i = 0
    for(; i <s.length; i++){
      const c = s[i]
      if (!pred(c)) {
        break
      }
    }

    return makeSymbolResult({
      valType: 'string',
      value: s.substr(0, i),
    }, s.substr(i))
  }
}

export function parseNumber(s: string): ParseResult<NumberVal> {
  const [ error, symbol, rest ] = takeAll(isDigit)(s)
  if (error !== null || symbol === null || rest === null) {
    return [`${s} is an invalid number`, null, null]
  }

  return [null, {
    valType: 'number',
    value: _.parseInt(symbol.value),
  }, rest]
}

function checkError<T extends LispVal, T2 extends LispVal>
  (result: ParseResult<T>, fn: (symbol: T, rest: string) => ParseResult<T2>): ParseResult<T2> {
  const [error, symbol, rest] = result;
  if (error !== null) {
    return [error, null, null]
  }
  if(symbol === null || rest == null) {
    return ['unexpected error', null, null]
  }
  return fn(symbol, rest)
}

/**
 * 组合两个parser， 第一个parser的输出传递给第二个
 * 如果第一个或第二个parser失败， 则整体失败
 */
function zip<T1 extends LispVal, T2 extends LispVal, T3 extends LispVal>
  (f1: ParserFn<T1>, f2: ParserFn<T2>, f3: (v: T1, v2: T2, r: string) => ParseResult<T3>): ParserFn<T3> {
  return (s: string) => {
    return checkError(f1(s), (symbol1, rest1) => {
      return checkError(f2(rest1), (symbol2, rest2) => {
        return f3(symbol1, symbol2, rest2)
      })
    })
  }
}

// function combine3<T1 extends LispVal, T2 extends LispVal, T3 extends LispVal, T4 extends LispVal>
//   (f1: ParserFn<T1>, f2: ParserFn<T2>, f3: ParserFn<T3>, f4: (v: T1, v2: T2, v3: T3) => ParseResult<T4>): ParserFn<T4> {
//     return (s: string) => {
//       combine(f1, f2, (v1, v2) => {
// 
//       })(s)
//     }
// }


// export function parseString(s: String): ParseResult<StringVal> {
//   combine(exactly('"'), )
//   return {
//   }
// }

export function parseLisp(s: string) {
  return s;
}

isBoundary('abc')
