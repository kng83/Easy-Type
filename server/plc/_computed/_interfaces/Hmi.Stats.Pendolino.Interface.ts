//#382

 import { BOOL, CHAR,BYTE,INT,WORD,DINT,DWORD,REAL,DATE_AND_TIME } from '../../plc-utility/awl.types'
 export interface HmiStatsPendolinoInterface{
         	
   HMI_IN : { 	//Zmienne wchodzace do HMI nie nadpisywane W HMI (100 bajtow) PLC-->HMI
    Reserwa_0_10 : BOOL ;	
    Reserwa_0_11 : BOOL ;	
    Reserwa_0_12 : BOOL ;	
    Reserwa_0_13 : BOOL ;	
    Reserwa_0_14 : BOOL ;	
    Reserwa_0_15 : BOOL ;	
    Reserwa_0_16 : BOOL ;	
    Reserwa_0_17 : BOOL ;	
    Reserwa_0_18 : BOOL ;	
    Reserwa_0_19 : BOOL ;	
    Reserwa_0_110 : BOOL ;	
    Reserwa_0_111 : BOOL ;	
    Reserwa_0_112 : BOOL ;	
    Reserwa_0_113 : BOOL ;	
    Reserwa_0_114 : BOOL ;	
    Reserwa_0_115 : BOOL ;	
    Reserwa_0_116 : BOOL ;	
    Reserwa_0_117 : BOOL ;	
    Reserwa_0_118 : BOOL ;	
    Reserwa_0_119 : BOOL ;	
    Reserwa_0_120 : BOOL ;	
    Reserwa_0_121 : BOOL ;	
    Reserwa_0_122 : BOOL ;	
    Reserwa_0_123 : BOOL ;	
    Reserwa_0_124 : BOOL ;	
    Reserwa_0_125 : BOOL ;	
    Reserwa_0_126 : BOOL ;	
    Reserwa_0_127 : BOOL ;	
    Reserwa_0_128 : BOOL ;	
    Reserwa_0_129 : BOOL ;	
    Reserwa_0_130 : BOOL ;	
    Reserwa_0_131 : BOOL ;	
    Reserwa_0_132 : BOOL ;	
    War_Licz_Palet_KB1 : DINT ;	//Wartosc licznika palet przewiezionych przez wozek
    War_Licz_Palet_KB2 : DINT ;	//Wartosc licznika palet przewiezionych przez wozek
    War_Licz_Palet_I1 : DINT ;	//Wartosc licznika palet przewiezionych przez wozek
    War_Licz_Palet_I2 : DINT ;	//Wartosc licznika palet przewiezionych przez wozek
    War_Licz_Palet_I3 : DINT ;	//Wartosc licznika palet przewiezionych przez wozek
    War_Licz_Palet_Gender : DINT ;	//Wartosc licznika palet przewiezionych na Gender
    War_Licz_Palet_O1 : DINT ;	//Wartosc palet odebranych przez odbieranie  
    War_Licz_Palet_Reserwa : DINT ;	
    Przejechane_KM : REAL ;	//Wartosc Km do(0.1KM) ile przejechal wozek
    Pomoc_Kilometry : DINT ;	
    Posuw_licznikow : INT ;	
    Tablica_IN_INT : INT[] ;	
    Tablica_IN_DWORD : DINT[] ;	
    Aktualna_Data : DATE_AND_TIME ;	
   } ;	
   HMI_OUT : { 	//Zmienne wychodzace z HMI Nie nadpisywane w sterowniku (od 100 bajta ) HMI-->PLC
    Wyzw_licznikow : BOOL ;	//wyzwolenie wyswietlania licznikow
    Reserwa_100_01 : BOOL ;	
    Reserwa_100_02 : BOOL ;	
    Reserwa_100_03 : BOOL ;	
    Reserwa_100_04 : BOOL ;	
    Reserwa_100_05 : BOOL ;	
    Reserwa_100_06 : BOOL ;	
    Reserwa_100_07 : BOOL ;	
    Reserwa_100_08 : BOOL ;	
    Reserwa_100_09 : BOOL ;	
    Reserwa_100_010 : BOOL ;	
    Reserwa_100_011 : BOOL ;	
    Reserwa_100_012 : BOOL ;	
    Reserwa_100_013 : BOOL ;	
    Reserwa_100_014 : BOOL ;	
    Reserwa_100_015 : BOOL ;	
    Reserwa_100_016 : BOOL ;	
    Reserwa_100_017 : BOOL ;	
    Reserwa_100_018 : BOOL ;	
    Reserwa_100_019 : BOOL ;	
    Reserwa_100_020 : BOOL ;	
    Reserwa_100_021 : BOOL ;	
    Reserwa_100_022 : BOOL ;	
    Reserwa_100_023 : BOOL ;	
    Reserwa_100_024 : BOOL ;	
    Reserwa_100_025 : BOOL ;	
    Reserwa_100_026 : BOOL ;	
    Reserwa_100_027 : BOOL ;	
    Reserwa_100_028 : BOOL ;	
    Reserwa_100_029 : BOOL ;	
    Reserwa_100_030 : BOOL ;	
    Reserwa_100_031 : BOOL ;	
    Reserwa_100_032 : BOOL ;	
    Reserwa_100_033 : DINT ;	//Wartosc licznika palet przewiezionych przez wozek
    Reserwa_100_034 : DINT ;	//Wartosc licznika palet przewiezionych przez wozek
    Reserwa_100_035 : DINT ;	//Wartosc licznika palet przewiezionych przez wozek
    Reserwa_100_036 : DINT ;	//Wartosc licznika palet przewiezionych przez wozek
    Reserwa_100_037 : DINT ;	//Wartosc licznika palet przewiezionych przez wozek
    Reserwa_100_038 : DINT ;	//Wartosc licznika palet przewiezionych na Gender
    Reserwa_100_039 : DINT ;	//Wartosc palet odebranych przez odbieranie  
    Reserwa_100_040 : DINT ;	
    Tablica_OUT_INT : INT[] ;	
    Tablica_OUT_DWORD : DWORD[] ;	
    Reserwa_DWORD : DWORD ;	
    Aktualna_Data : DATE_AND_TIME ;	
   } ;	
   HMI_IN_OUT : { 	//Zmienne nadpisywane w sterowniku i w HMI od 200 bajta
    Reserwa_200_0 : BOOL ;	
    Reserwa_200_1 : BOOL ;	
    Reserwa_200_11 : BOOL ;	
    Reserwa_200_12 : BOOL ;	
    Reserwa_200_13 : BOOL ;	
    Reserwa_200_14 : BOOL ;	
    Reserwa_200_15 : BOOL ;	
    Reserwa_200_16 : BOOL ;	
    Reserwa_200_17 : BOOL ;	
    Reserwa_200_18 : BOOL ;	
    Reserwa_200_19 : BOOL ;	
    Reserwa_200_110 : BOOL ;	
    Reserwa_200_111 : BOOL ;	
    Reserwa_200_112 : BOOL ;	
    Reserwa_200_113 : BOOL ;	
    Reserwa_200_114 : BOOL ;	
    Reserwa_200_115 : BOOL ;	
    Reserwa_200_116 : BOOL ;	
    Reserwa_200_117 : BOOL ;	
    Reserwa_200_118 : BOOL ;	
    Reserwa_200_119 : BOOL ;	
    Reserwa_200_120 : BOOL ;	
    Reserwa_200_121 : BOOL ;	
    Reserwa_200_122 : BOOL ;	
    Reserwa_200_123 : BOOL ;	
    Reserwa_200_124 : BOOL ;	
    Reserwa_200_125 : BOOL ;	
    Reserwa_200_126 : BOOL ;	
    Reserwa_200_127 : BOOL ;	
    Reserwa_200_128 : BOOL ;	
    Reserwa_200_129 : BOOL ;	
    Reserwa_200_130 : BOOL ;	
    Reserwa_200_131 : BOOL ;	
    Tablica_IN_OUT_INT : INT[] ;	
    Tablica_IN_OUT_DWORD : DWORD[] ;	
    Aktualna_Data : DATE_AND_TIME ;	
   } ;	
  }