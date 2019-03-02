//#382

 import { BOOL, CHAR,BYTE,INT,WORD,DINT,DWORD,REAL,DATE_AND_TIME } from '../../plc-utility/awl.types'
 export interface HmiZfInterface{
        
   MM_Allg : {
    Res_DBW0 :  INT  ; //
    Res_DBW2 :  INT  ; //
    Res_DBW4 :  INT  ; //
    Res_DBW5 :  INT  ; //
    Res_DBW6 :  INT  ; //
    Status_OPC :  BOOL  ; //Status Simatic S7 <> OPC-Server Verbindung
    Res_DBX10_1 :  BOOL  ; //
    Res_DBX10_2 :  BOOL  ; //
    Res_DBX10_3 :  BOOL  ; //
    Res_DBX10_4 :  BOOL  ; //
    Res_DBX10_5 :  BOOL  ; //
    Res_DBX10_6 :  BOOL  ; //
    Res_DBX10_7 :  BOOL  ; //
    Res_DBX11_0 :  BOOL  ; //
    Res_DBX11_1 :  BOOL  ; //
    Res_DBX11_2 :  BOOL  ; //
    Res_DBX11_3 :  BOOL  ; //
    Res_DBX11_4 :  BOOL  ; //
    Res_DBX11_5 :  BOOL  ; //
    Res_DBX11_6 :  BOOL  ; //
    Res_DBX11_7 :  BOOL  ; //
    Res_Array :  BYTE[]  ; //
   } ;
   MM_BSend_FA01 : {
    Reset_IW_Maku_Ausl_A_S1 :  BOOL  ; //Istwert Makuz�hler Auslage A (Falz 01 - S1) zur�cksetzen
    Reset_IW_Maku_Ausl_B_S1 :  BOOL  ; //Istwert Makuz�hler Auslage B (Falz 01 - S1) zur�cksetzen
    Reset_IW_Maku_Ausl_C_S1 :  BOOL  ; //Istwert Makuz�hler Auslage C (Falz 01 - S1) zur�cksetzen
    Reset_IW_Netto_Ausl_A_S1 :  BOOL  ; //Istwert Nettoz�hler Auslage A (Falz 01 - S1) zur�cksetzen
    Reset_IW_Netto_Ausl_B_S1 :  BOOL  ; //Istwert Nettoz�hler Auslage B (Falz 01 - S1) zur�cksetzen
    Reset_IW_Netto_Ausl_C_S1 :  BOOL  ; //Istwert Nettoz�hler Auslage C (Falz 01 - S1) zur�cksetzen
    Res_DBX100_6 :  BOOL  ; //
    Res_DBX100_7 :  BOOL  ; //
    Reset_IW_Maku_Ausl_A_S2 :  BOOL  ; //Istwert Makuz�hler Auslage A (Falz 01 - S2) zur�cksetzen
    Reset_IW_Maku_Ausl_B_S2 :  BOOL  ; //Istwert Makuz�hler Auslage B (Falz 01 - S2) zur�cksetzen
    Reset_IW_Maku_Ausl_C_S2 :  BOOL  ; //Istwert Makuz�hler Auslage C (Falz 01 - S2) zur�cksetzen
    Reset_IW_Netto_Ausl_A_S2 :  BOOL  ; //Istwert Nettoz�hler Auslage A (Falz 01 - S2) zur�cksetzen
    Reset_IW_Netto_Ausl_B_S2 :  BOOL  ; //Istwert Nettoz�hler Auslage B (Falz 01 - S2) zur�cksetzen
    Reset_IW_Netto_Ausl_C_S2 :  BOOL  ; //Istwert Nettoz�hler Auslage C (Falz 01 - S2) zur�cksetzen
    Res_DBX101_6 :  BOOL  ; //
    Res_DBX101_7 :  BOOL  ; //
    Res_Array :  BYTE[]  ; //
   } ;
   MM_BSend_FA02 : {
    Reset_IW_Maku_Ausl_A_S1 :  BOOL  ; //Istwert Makuz�hler Auslage A (Falz 02 - S1) zur�cksetzen
    Reset_IW_Maku_Ausl_B_S1 :  BOOL  ; //Istwert Makuz�hler Auslage B (Falz 02 - S1) zur�cksetzen
    Reset_IW_Maku_Ausl_C_S1 :  BOOL  ; //Istwert Makuz�hler Auslage C (Falz 02 - S1) zur�cksetzen
    Reset_IW_Netto_Ausl_A_S1 :  BOOL  ; //Istwert Nettoz�hler Auslage A (Falz 02 - S1) zur�cksetzen
    Reset_IW_Netto_Ausl_B_S1 :  BOOL  ; //Istwert Nettoz�hler Auslage B (Falz 02 - S1) zur�cksetzen
    Reset_IW_Netto_Ausl_C_S1 :  BOOL  ; //Istwert Nettoz�hler Auslage C (Falz 02 - S1) zur�cksetzen
    Res_DBX100_6 :  BOOL  ; //
    Res_DBX100_7 :  BOOL  ; //
    Reset_IW_Maku_Ausl_A_S2 :  BOOL  ; //Istwert Makuz�hler Auslage A (Falz 02 - S2) zur�cksetzen
    Reset_IW_Maku_Ausl_B_S2 :  BOOL  ; //Istwert Makuz�hler Auslage B (Falz 02 - S2) zur�cksetzen
    Reset_IW_Maku_Ausl_C_S2 :  BOOL  ; //Istwert Makuz�hler Auslage C (Falz 02 - S2) zur�cksetzen
    Reset_IW_Netto_Ausl_A_S2 :  BOOL  ; //Istwert Nettoz�hler Auslage A (Falz 02 - S2) zur�cksetzen
    Reset_IW_Netto_Ausl_B_S2 :  BOOL  ; //Istwert Nettoz�hler Auslage B (Falz 02 - S2) zur�cksetzen
    Reset_IW_Netto_Ausl_C_S2 :  BOOL  ; //Istwert Nettoz�hler Auslage C (Falz 02 - S2) zur�cksetzen
    Res_DBX101_6 :  BOOL  ; //
    Res_DBX101_7 :  BOOL  ; //
    Res_Array :  BYTE[]  ; //
   } ;
   MM_BRCV_FA01 : {
    Z_BackupWeiche_S1 :  BOOL  ; //Stellung Backupweiche (Falz 01 - S1)
    Z_MakuWeiche_Ausl_A_S1 :  BOOL  ; //Stellung Makuweiche Auslage A (Falz 01 - S1)
    Z_MakuWeiche_Ausl_B_S1 :  BOOL  ; //Stellung Makuweiche Auslage B (Falz 01 - S1)
    Z_MakuWeiche_Ausl_C_S1 :  BOOL  ; //Stellung Makuweiche Auslage C (Falz 01 - S1)
    Z_MakuStatus_Ausl_A_S1 :  BOOL  ; //Makustatus am Definitionspunkt Auslage A (Falz 01 - S1)
    Z_MakuStatus_Ausl_B_S1 :  BOOL  ; //Makustatus am Definitionspunkt Auslage B (Falz 01 - S1)
    Z_MakuStatus_Ausl_C_S1 :  BOOL  ; //Makustatus am Definitionspunkt Auslage C (Falz 01 - S1)
    Z_08 :  BOOL  ; //
    Z_BackupWeiche_S2 :  BOOL  ; //Stellung Backupweiche (Falz 01 - S2)
    Z_MakuWeiche_Ausl_A_S2 :  BOOL  ; //Stellung Makuweiche Auslage A (Falz 01 - S2)
    Z_MakuWeiche_Ausl_B_S2 :  BOOL  ; //Stellung Makuweiche Auslage B (Falz 01 - S2)
    Z_MakuWeiche_Ausl_C_S2 :  BOOL  ; //Stellung Makuweiche Auslage C (Falz 01 - S2)
    Z_MakuStatus_Ausl_A_S2 :  BOOL  ; //Makustatus am Definitionspunkt Auslage A (Falz 01 - S2)
    Z_MakuStatus_Ausl_B_S2 :  BOOL  ; //Makustatus am Definitionspunkt Auslage B (Falz 01 - S2)
    Z_MakuStatus_Ausl_C_S2 :  BOOL  ; //Makustatus am Definitionspunkt Auslage C (Falz 01 - S2)
    Z_16 :  BOOL  ; //
    IW_Maku_Ausl_A_S1 :  REAL  ; //Istwert Makuz�hler Auslage A (Falz 01 - S1)
    IW_Maku_Ausl_B_S1 :  REAL  ; //Istwert Makuz�hler Auslage B (Falz 01 - S1)
    IW_Maku_Ausl_C_S1 :  REAL  ; //Istwert Makuz�hler Auslage C (Falz 01 - S1)
    IW_Netto_Ausl_A_S1 :  REAL  ; //Istwert Nettoz�hler Auslage A (Falz 01 - S1)
    IW_Netto_Ausl_B_S1 :  REAL  ; //Istwert Nettoz�hler Auslage B (Falz 01 - S1)
    IW_Netto_Ausl_C_S1 :  REAL  ; //Istwert Nettoz�hler Auslage C (Falz 01 - S1)
    IW_Netto_RO1_Ausl_A_S1 :  REAL  ; //Istwert Nettoz�hler von Rolle 1 der Auslage A (Falz 01 - S1)
    IW_Netto_RO1_Ausl_B_S1 :  REAL  ; //Istwert Nettoz�hler von Rolle 1 der Auslage B (Falz 01 - S1)
    IW_Netto_RO1_Ausl_C_S1 :  REAL  ; //Istwert Nettoz�hler von Rolle 1 der Auslage C (Falz 01 - S1)
    IW_Netto_RO2_Ausl_A_S1 :  REAL  ; //Istwert Nettoz�hler von Rolle 2 der Auslage A (Falz 01 - S1)
    IW_Netto_RO2_Ausl_B_S1 :  REAL  ; //Istwert Nettoz�hler von Rolle 2 der Auslage B (Falz 01 - S1)
    IW_Netto_RO2_Ausl_C_S1 :  REAL  ; //Istwert Nettoz�hler von Rolle 2 der Auslage C (Falz 01 - S1)
    IW_28 :  REAL  ; //
    IW_29 :  REAL  ; //
    IW_30 :  REAL  ; //
    IW_Maku_Ausl_A_S2 :  REAL  ; //Istwert Makuz�hler Auslage A (Falz 01 - S2)
    IW_Maku_Ausl_B_S2 :  REAL  ; //Istwert Makuz�hler Auslage B (Falz 01 - S2)
    IW_Maku_Ausl_C_S2 :  REAL  ; //Istwert Makuz�hler Auslage C (Falz 01 - S2)
    IW_Netto_Ausl_A_S2 :  REAL  ; //Istwert Nettoz�hler Auslage A (Falz 01 - S2)
    IW_Netto_Ausl_B_S2 :  REAL  ; //Istwert Nettoz�hler Auslage B (Falz 01 - S2)
    IW_Netto_Ausl_C_S2 :  REAL  ; //Istwert Nettoz�hler Auslage C (Falz 01 - S2)
    IW_Netto_RO1_Ausl_A_S2 :  REAL  ; //Istwert Nettoz�hler von Rolle 1 der Auslage A (Falz 01 - S2)
    IW_Netto_RO1_Ausl_B_S2 :  REAL  ; //Istwert Nettoz�hler von Rolle 1 der Auslage B (Falz 01 - S2)
    IW_Netto_RO1_Ausl_C_S2 :  REAL  ; //Istwert Nettoz�hler von Rolle 1 der Auslage C (Falz 01 - S2)
    IW_Netto_RO2_Ausl_A_S2 :  REAL  ; //Istwert Nettoz�hler von Rolle 2 der Auslage A (Falz 01 - S2)
    IW_Netto_RO2_Ausl_B_S2 :  REAL  ; //Istwert Nettoz�hler von Rolle 2 der Auslage B (Falz 01 - S2)
    IW_Netto_RO2_Ausl_C_S2 :  REAL  ; //Istwert Nettoz�hler von Rolle 2 der Auslage C (Falz 01 - S2)
    IW_13 :  REAL  ; //
    IW_14 :  REAL  ; //
    IW_15 :  REAL  ; //
    Res_Array :  BYTE[]  ; //
   } ;
   MM_BRCV_FA02 : {
    Z_BackupWeiche_S1 :  BOOL  ; //Stellung Backupweiche (Falz 02 - S1)
    Z_MakuWeiche_Ausl_A_S1 :  BOOL  ; //Stellung Makuweiche Auslage A (Falz 02 - S1)
    Z_MakuWeiche_Ausl_B_S1 :  BOOL  ; //Stellung Makuweiche Auslage B (Falz 02 - S1)
    Z_MakuWeiche_Ausl_C_S1 :  BOOL  ; //Stellung Makuweiche Auslage C (Falz 02 - S1)
    Z_MakuStatus_Ausl_A_S1 :  BOOL  ; //Makustatus am Definitionspunkt Auslage A (Falz 02 - S1)
    Z_MakuStatus_Ausl_B_S1 :  BOOL  ; //Makustatus am Definitionspunkt Auslage B (Falz 02 - S1)
    Z_MakuStatus_Ausl_C_S1 :  BOOL  ; //Makustatus am Definitionspunkt Auslage C (Falz 02 - S1)
    Z_08 :  BOOL  ; //
    Z_BackupWeiche_S2 :  BOOL  ; //Stellung Backupweiche (Falz 02 - S2)
    Z_MakuWeiche_Ausl_A_S2 :  BOOL  ; //Stellung Makuweiche Auslage A (Falz 02 - S2)
    Z_MakuWeiche_Ausl_B_S2 :  BOOL  ; //Stellung Makuweiche Auslage B (Falz 02 - S2)
    Z_MakuWeiche_Ausl_C_S2 :  BOOL  ; //Stellung Makuweiche Auslage C (Falz 02 - S2)
    Z_MakuStatus_Ausl_A_S2 :  BOOL  ; //Makustatus am Definitionspunkt Auslage A (Falz 02 - S2)
    Z_MakuStatus_Ausl_B_S2 :  BOOL  ; //Makustatus am Definitionspunkt Auslage B (Falz 02 - S2)
    Z_MakuStatus_Ausl_C_S2 :  BOOL  ; //Makustatus am Definitionspunkt Auslage C (Falz 02 - S2)
    Z_16 :  BOOL  ; //
    IW_Maku_Ausl_A_S1 :  REAL  ; //Istwert Makuz�hler Auslage A (Falz 02 - S1)
    IW_Maku_Ausl_B_S1 :  REAL  ; //Istwert Makuz�hler Auslage B (Falz 02 - S1)
    IW_Maku_Ausl_C_S1 :  REAL  ; //Istwert Makuz�hler Auslage C (Falz 02 - S1)
    IW_Netto_Ausl_A_S1 :  REAL  ; //Istwert Nettoz�hler Auslage A (Falz 02 - S1)
    IW_Netto_Ausl_B_S1 :  REAL  ; //Istwert Nettoz�hler Auslage B (Falz 02 - S1)
    IW_Netto_Ausl_C_S1 :  REAL  ; //Istwert Nettoz�hler Auslage C (Falz 02 - S1)
    IW_Netto_RO1_Ausl_A_S1 :  REAL  ; //Istwert Nettoz�hler von Rolle 1 der Auslage A (Falz 02 - S1)
    IW_Netto_RO1_Ausl_B_S1 :  REAL  ; //Istwert Nettoz�hler von Rolle 1 der Auslage B (Falz 02 - S1)
    IW_Netto_RO1_Ausl_C_S1 :  REAL  ; //Istwert Nettoz�hler von Rolle 1 der Auslage C (Falz 02 - S1)
    IW_Netto_RO2_Ausl_A_S1 :  REAL  ; //Istwert Nettoz�hler von Rolle 2 der Auslage A (Falz 02 - S1)
    IW_Netto_RO2_Ausl_B_S1 :  REAL  ; //Istwert Nettoz�hler von Rolle 2 der Auslage B (Falz 02 - S1)
    IW_Netto_RO2_Ausl_C_S1 :  REAL  ; //Istwert Nettoz�hler von Rolle 2 der Auslage C (Falz 02 - S1)
    IW_28 :  REAL  ; //
    IW_29 :  REAL  ; //
    IW_30 :  REAL  ; //
    IW_Maku_Ausl_A_S2 :  REAL  ; //Istwert Makuz�hler Auslage A (Falz 02 - S2)
    IW_Maku_Ausl_B_S2 :  REAL  ; //Istwert Makuz�hler Auslage B (Falz 02 - S2)
    IW_Maku_Ausl_C_S2 :  REAL  ; //Istwert Makuz�hler Auslage C (Falz 02 - S2)
    IW_Netto_Ausl_A_S2 :  REAL  ; //Istwert Nettoz�hler Auslage A (Falz 02 - S2)
    IW_Netto_Ausl_B_S2 :  REAL  ; //Istwert Nettoz�hler Auslage B (Falz 02 - S2)
    IW_Netto_Ausl_C_S2 :  REAL  ; //Istwert Nettoz�hler Auslage C (Falz 02 - S2)
    IW_Netto_RO1_Ausl_A_S2 :  REAL  ; //Istwert Nettoz�hler von Rolle 1 der Auslage A (Falz 02 - S2)
    IW_Netto_RO1_Ausl_B_S2 :  REAL  ; //Istwert Nettoz�hler von Rolle 1 der Auslage B (Falz 02 - S2)
    IW_Netto_RO1_Ausl_C_S2 :  REAL  ; //Istwert Nettoz�hler von Rolle 1 der Auslage C (Falz 02 - S2)
    IW_Netto_RO2_Ausl_A_S2 :  REAL  ; //Istwert Nettoz�hler von Rolle 2 der Auslage A (Falz 02 - S2)
    IW_Netto_RO2_Ausl_B_S2 :  REAL  ; //Istwert Nettoz�hler von Rolle 2 der Auslage B (Falz 02 - S2)
    IW_Netto_RO2_Ausl_C_S2 :  REAL  ; //Istwert Nettoz�hler von Rolle 2 der Auslage C (Falz 02 - S2)
    IW_13 :  REAL  ; //
    IW_14 :  REAL  ; //
    IW_15 :  REAL  ; //
    Res_Array :  BYTE[]  ; //
   } ;
   MM_BRCV_Allg : {
    Z_ToggleBit :  BOOL  ; //Togglebit
    Z_02 :  BOOL  ; //
    Z_03 :  BOOL  ; //
    Z_04 :  BOOL  ; //
    Z_05 :  BOOL  ; //
    Z_06 :  BOOL  ; //
    Z_07 :  BOOL  ; //
    Z_08 :  BOOL  ; //
    Z_09 :  BOOL  ; //
    Z_10 :  BOOL  ; //
    Z_11 :  BOOL  ; //
    Z_12 :  BOOL  ; //
    Z_13 :  BOOL  ; //
    Z_14 :  BOOL  ; //
    Z_15 :  BOOL  ; //
    Z_16 :  BOOL  ; //
    Res_Array :  BYTE[]  ; //
   } ;
  }