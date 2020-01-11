export type ValType = 'number' | 'sep' | 'string';
export interface LispVal {
  valType: ValType;
}

export interface SepVal extends LispVal {
  valType: 'sep';
  value: string;
}

export interface NumberVal extends LispVal {
  valType: 'number';
  value: number;
}

export interface StringVal extends LispVal {
  valType: 'string';
  value: string;
}

export interface SymbolResult<T> {
  symbol: T;
  rest: string;
}

export interface TakeAllResult {
  str: string;
  rest: string;
}

export type ParseResult<T extends LispVal>  = [string, null, null] | [null, T, string]