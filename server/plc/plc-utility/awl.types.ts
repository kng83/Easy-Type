export enum Area {
  S7AreaPE = 0x81,
  S7AreaPA = 0x82,
  S7AreaMK = 0x83,
  S7AreaDB = 0x84,
  S7AreaCT = 0x1C,
  S7AreaTM = 0x1D
}

export enum WordLen {
  S7WLBit = 0x01,
  S7WLByte = 0x02,
  S7WLWord = 0x04,
  S7WLDWord = 0x06,
  S7WLReal = 0x08,
  S7WLCounter = 0x1C,
  S7WLTimer = 0x1D
}

export enum DBAwlTypes {
  BOOL = 0x01,
  BYTE = 0x02,
  CHAR = 0x02,
  WORD = 0x04,
  INT = 0x04,
  DWORD = 0x06,
  REAL = 0x08,
  COUNTER = 0x1C,
  TIMER = 0x1D
}

export enum PlcTypes {
  BOOL = "BOOL",
  BYTE = "BYTE",
  CHAR = "CHAR",
  WORD = "WORD",
  INT = "INT",
  DINT = "DINT",
  DWORD = "DWORD",
  REAL = "REAL",
  COUNTER = "COUNTER",
  TIMER = "TIMER",
  DATE_AND_TIME = "DATE_AND_TIME"
}

export let typeOf1Byte = [
  "CHAR", "BYTE"
];
export let typeOf2Bytes = [
  "INT", "WORD", "COUNTER", "TIMER"
];
export let typeOf4Bytes = [
  "DWORD", "DINT", "REAL", "TIME"
];
export let typeOf8Bytes = [
  "DATE_AND_TIME"
];
//This order is important because firs we find DWORD the WORD
//TODO make something that order will not matter
export let typeOfAll = [...typeOf8Bytes, ...typeOf4Bytes, ...typeOf2Bytes, ...typeOf1Byte, "BOOL"];

// //**** Interfaces
// export interface BOOL {
//   value: number | boolean;
// }
//
// export interface BYTE {
//   value: number;
// }
//
// export interface CHAR {
//   value: string;
// }
//
// export interface WORD {
//   value: number;
// }
//
// export interface INT {
//   value: number;
// }
//
// export interface COUNTER {
//   value: number;
// }
//
// export interface TIMER {
//   value: number;
// }
//
// export interface DWORD {
//   value: number;
// }
//
// export interface DINT {
//   value: number;
// }
//
// export interface REAL {
//   value: number;
// }
//
// export interface TIME {
//   value: number;
// }
//
// export interface DATE_AND_TIME {
//   value: number;
//}

export type BOOL = boolean | number;

export type BYTE = number;
export type CHAR = string;
export type WORD = number;
export type INT = number;
export type COUNTER = number;
export type TIMER = number;
export type DWORD = number;
export type DINT = number ;
export type REAL = number;
export type TIME = number;
export type DATE_AND_TIME = number;


export interface DbRow {
  type: string;
  db: number;
  dbb: number;
  bit: number;
  desc: string;
  sD: number;
  value?: any;
  rOk?: any;
  wOk?: any;
}




