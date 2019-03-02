import { readSingleFile, createAwlInterface } from './plc-utility/awl.files.converter';
import { printObject } from "../base/model-preparation/model_creator/Object.Tree.Runner";
import { variableFileCreatorFactory } from "../base/model-preparation/model_creator/File.Creator";
import { objWrapper, interfaceWrapper } from "../base/model-preparation/model_creator/File.Wrappers";
import { printInterface } from '../base/model-preparation/model_creator/Interface.Tree.Runner';
import { BOOL, CHAR, BYTE, INT, WORD, DINT, DWORD, REAL, DATE_AND_TIME } from './plc-utility/awl.types';


Promise.all([
    readSingleFile('./server/plc/awl-files/DB129_HMI_STATS.AWL', 's7-300'),
    readSingleFile('./server/plc/awl-files/db3_super.db', 's7-1200'),
    readSingleFile('./server/plc/awl-files/super_db119.db', 's7-1200')
])
    .then(data => {
        variableFileCreatorFactory('true', { destPath: './server/plc/_computed/_datablocks', callPath: __dirname }, [
            {
                fileName: 'Hmi.Stats.Pendolino.ts',
                payloadWrapper: objWrapper,
                payload: printObject(data[0])
            },
            {
                fileName: 'First.Some.ts',
                payloadWrapper: objWrapper,
                payload: printObject(data[1]),
            },
            {
                fileName: 'third.Some.ts',
                payloadWrapper: objWrapper,
                payload: printObject(data[2])
            }
        ]);
    }).catch(e => console.log(e.message));



Promise.all([
    createAwlInterface('./server/plc/awl-files/DB129_HMI_STATS.AWL'),
    createAwlInterface('./server/plc/awl-files/db3_super.db'),
    createAwlInterface('./server/plc/awl-files/HMI_Com_ZF_DB331.AWL'),


]).then(data => {
    variableFileCreatorFactory('true',
        { destPath: './server/plc/_computed/_interfaces', callPath: __dirname }, [
            {
                fileName: 'Hmi.Stats.Pendolino.Interface.ts',
                payloadWrapper: interfaceWrapper,
                payload: printInterface(data[0]),
                addImports: ["import { BOOL, CHAR,BYTE,INT,WORD,DINT,DWORD,REAL,DATE_AND_TIME } from './plc-utility/awl.types'"]
            },
            {
                fileName: 'First.Some.Interface.ts',
                payloadWrapper: interfaceWrapper,
                payload: printInterface(data[1]),
                addImports: ["import { BOOL, CHAR,BYTE,INT,WORD,DINT,DWORD,REAL,DATE_AND_TIME } from './plc-utility/awl.types'"]
            },
            {
                fileName: 'Hmi.Zf.Interface.ts',
                payloadWrapper: interfaceWrapper,
                payload: printInterface(data[2]),
                addImports: ["import { BOOL, CHAR,BYTE,INT,WORD,DINT,DWORD,REAL,DATE_AND_TIME } from './plc-utility/awl.types'"]
            },

        ]);
}).catch(e => console.log(e.message));
