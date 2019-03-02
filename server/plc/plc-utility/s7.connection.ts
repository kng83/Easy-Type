import { Area } from './awl.types';
import { DBAwlTypes, DbRow, PlcTypes } from './awl.types';
import snap7, { MultiVarRead, MultiVarWrite } from 'node-snap7';


export class PLC {
  private client: snap7.S7Client;

  static connect(connectionParams: ConnectionParams) {
    return new PLC(connectionParams);

  }

  constructor(connectionParams: ConnectionParams) {

    this.client = new snap7.S7Client();
    this.client.ConnectTo(connectionParams.ip, connectionParams.rackNr, connectionParams.slot, (err) => {
      try {
        if (err) throw new Error(`>> Connection failed. Code # ${err}  ${this.client.ErrorText(err)}`);
      } catch (e) {
        console.log(e.stack);
      }
    });
    return this;
  }

  //*** Write resolved data to datablock */
  writeDataToPLC(data, dataModel) {
    //return this.dbWriter(this.resolveDataToPlc(data, dataModel));
    return this.promiseDataToPlc(data, dataModel).then(d => this.dbEcho(d)).then(d => this.parseDataFromPlc(data, d));
  }
  //*** Read resolved data from datablock */
  readDataFromPLC(data, dataModel) {
    return this.promiseDataToPlc(data, dataModel)
      .then(d => this.dbEcho(d))
      //   .then(d =>  this.dbReader(d))
      .then(d => this.parseDataFromPlc(data, d));
  }

  //*** Read chosen data from datablock */
  dbReader<T extends DbRow>(arr: T[]) {
    let createArr = arr.map(element => readPlcDbValue(element));
    return new Promise((resolve, reject) => {
      this.client.ReadMultiVars((createArr), (err, res) => {
        if (err) return reject(err);
        res.forEach((r, index) => {
          arr[index].value = parseReadResponse(r.Data, arr[index].type);
          arr[index].rOk = r.Result === 0;
          arr[index].wOk = false;
        });
        resolve(arr);
      });
    });
  }

  //***memorize remembers the actual value before write.This is ok for 2-level copy */
  dbWriter<T extends DbRow>(arr: T[]) {
    let createArr: any = arr.map(element => writePlcValues(element));
    const memorize = arr.map(element => Object.assign({}, element));

    return new Promise((resolve, reject) => {
      this.client.WriteMultiVars(createArr, (err, data) => {
        if (err) return reject(err);
        data.forEach((value, index) => {
          arr[index].wOk = value.Result === 0;
          arr[index].rOk = false;
          arr[index].value = memorize[index].value;
        });
        resolve(arr);
      });
    });
  }

  dbEcho<T>(arr: T[]) {
    return new Promise((resolve, reject) => {
      resolve(arr);
    });
  }

  //*** Make array of object which comes from data object. Data objects are transformed to pattern object style and put into array  */
  //Todo make this function single responsible
  private resolveDataToPlc(data, dataModel) {
    function recursion(data, dataModel, arr = []) {
      Object.keys(data).forEach(dataKey => {
        if (typeof data[dataKey] === "object") {
          recursion(data[dataKey], dataModel[dataKey], arr);
        }
        let helpObj = { ...dataModel[dataKey] };
        if (dataModel[dataKey].hasOwnProperty("value")) {
          helpObj.value = data[dataKey];
          arr.push({ ...helpObj });
        }
      });
      return arr;
    }

    try {
      return recursion(data, dataModel);
    } catch (e) {
      return null;
    }
  }

  private promiseDataToPlc(data, dataModel): Promise<any[]> {
    return new Promise(resolve => {
      function recursion(data, dataModel, dataArr = []) {
        Object.keys(data).forEach(dataKey => {
          if (typeof data[dataKey] === "object") {
            recursion(data[dataKey], dataModel[dataKey], dataArr);
          }
          let helpObj = { ...dataModel[dataKey] };
          if (dataModel[dataKey].hasOwnProperty("value")) {
            helpObj.value = data[dataKey];
            dataArr.push({ ...helpObj });
          }
        });
        return dataArr;
      }
      console.log('here is resolved function');
      let arr = recursion(data, dataModel);
      return resolve(arr);
    });
  }

  parseDataFromPlc(dataPattern, dataAnswer) {
    function recursion(dataPattern, dataAnswer, counter = 0) {
      Object.keys(dataPattern).forEach(dataKey => {
        if (typeof dataPattern[dataKey] === "object") {
          return recursion(dataPattern[dataKey], dataAnswer, counter);
        }
        dataPattern[dataKey] = dataAnswer[counter]['value'];
        counter++;
      });
      return dataPattern;
    }
    return recursion(dataPattern, dataAnswer);

  }

  disconnect() {
    this.client.Disconnect();
  }
}


//**** Help functions */
//*** Make single array element for reading plc values */
function readPlcDbValue(v: DbRow): MultiVarRead {
  return {
    "Area": Area.S7AreaDB,
    "WordLen": DBAwlTypes[v.type],
    "DBNumber": v.db,
    "Start": v.type === 'BOOL' ? v.dbb * 8 + v.bit : v.dbb,
    "Amount": 1
  };
}

//*** Make single array element for writing plc values */
function writePlcValues(v: DbRow): MultiVarWrite {
  return {
    "Area": Area.S7AreaDB,
    "WordLen": DBAwlTypes[v.type],
    "DBNumber": v.db,
    "Start": v.type === 'BOOL' ? v.dbb * 8 + v.bit : v.dbb,
    "Amount": 1,
    "Data": formatBufferData(v.value, v.type)
  };
}

//*** Allocate buffer size for writing data */
function bufferAllocation<T extends Extract<keyof Buffer, string>>
  (nrOfBytes: number, fn: T, value) {
  let buffer = Buffer.alloc(nrOfBytes);
  buffer[`${fn}`](value, 0);
  return buffer;
}
//*** Convert response to readable format */
function parseReadResponse(data: Buffer, type: string) {
  if (type === PlcTypes.BOOL) return data.readUInt8(0);
  if (type === PlcTypes.BYTE) return data.readUInt8(0);
  if (type === PlcTypes.CHAR) return data.readUInt8(0);
  if (type === PlcTypes.WORD) return data.readUInt16BE(0);
  if (type === PlcTypes.INT) return data.readInt16BE(0);
  if (type === PlcTypes.DINT) return data.readInt32BE(0);
  if (type === PlcTypes.DWORD) return data.readUInt32BE(0);
  if (type === PlcTypes.REAL) return data.readFloatBE(0);
  if (type === PlcTypes.COUNTER) return data.readUInt16BE(0);
  else return 0;
}

//*** Create buffer for sending data to plc */
function formatBufferData(value: any, type: string) {
  if (type === PlcTypes.BOOL) return (value === 1 || value === true)
    ? Buffer.from([0x01]) : (value === 0 || value === false) ? Buffer.from([0x00]) : null;
  if (type === PlcTypes.BYTE) return bufferAllocation(1, 'writeUInt8', value);
  if (type === PlcTypes.CHAR) return new Buffer(value, 'ascii');
  if (type === PlcTypes.INT) return bufferAllocation(2, 'writeInt16BE', value);
  if (type === PlcTypes.WORD) return bufferAllocation(2, 'writeUInt16BE', value);
  if (type === PlcTypes.DINT) return bufferAllocation(4, 'writeInt32BE', value);
  if (type === PlcTypes.DWORD) return bufferAllocation(4, 'writeUInt32BE', value);
  if (type === PlcTypes.REAL) return bufferAllocation(4, 'writeFloatBE', value);
  if (type === PlcTypes.COUNTER) return bufferAllocation(2, 'writeUInt16BE', value);
}


//*** Interfaces */
export interface ConnectionParams {
  ip: string;
  rackNr: number;
  slot: number;
}

