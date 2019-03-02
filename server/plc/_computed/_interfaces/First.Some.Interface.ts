//#382

import { BOOL, CHAR, BYTE, INT, WORD, DINT, DWORD, REAL, DATE_AND_TIME } from '../../plc-utility/awl.types';

export interface FirstSomeInterface {


  some_1: BOOL;
  some_2: BOOL;
  som6: BOOL;
  som5: BOOL;
  som4: BOOL;
  som3: BOOL;
  som2: BOOL;
  some_3: BOOL;
  some_Int_1: INT;
  some_bit_0: BOOL;
  some_byte_1: BYTE;
  some_bit: BOOL;
  some_real: REAL;
  some_bit_1: BOOL;   // some 1
  some_real_2: REAL;
  some_bit_3: BOOL;
  some_int: INT;
  wasyl: {   // some 2
    some_1: BOOL;
    int_1: INT;
    bool_End: BOOL;
    some: BOOL;
    some2: BOOL;
    some3: BOOL;
    some4: BOOL;
    some5: BOOL;
    some6: BOOL;
    some7: BOOL;
    some8: BOOL;
    some9: BOOL;
  };
  some_4: BOOL;   // some 3
  Other_Real: REAL;
  some_arr: BYTE;
  some_bool_2: BOOL;
  some_other_arr: INT;   // tekst some
  some_9_bool: BOOL;
  other_Struct: {
    one: BOOL;
    two: BOOL;
    three: BOOL;
  };
  some_other: BOOL;
  r1: BOOL;
  some_bool_4: BOOL;
  some_robert: BOOL;
  other: BOOL;
  some_Struct: {   // jal
    rob: BOOL;
    dipper_Struct: {
      littleOne: BOOL;
      litttleTwo: INT;
    };
  };
  addidas: BOOL;
  kot_1: {
    item_1: BOOL;
    item_2: BOOL;
  };
  byte_1: BYTE;
  some_bit_2: BOOL;
  some_byte: BYTE;
  some_other_bit: BOOL;
  char_1: CHAR;
  bool_one: BOOL;
  int_44: INT;
  sbool: BOOL;
  sReal: REAL;
  ssbool: BOOL;
  ssInt: INT;
  sssbool: BOOL;
  sssByte: BYTE;
  sssReal: REAL;
  arr_big: BYTE;
  new_bool: BOOL;
  lastStruct: {
    bool1: INT;
    bool2: BOOL;
    bool3: BOOL;
    bool4: BOOL;
    d1: BOOL;
    d2: BOOL;
    d3: BOOL;
    d4: BOOL;
    d5: BOOL;
  };
  newInt: INT;
}
