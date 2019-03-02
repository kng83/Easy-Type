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
    return this.resolveDataToPlc(data, dataModel)
      .then(d => this.dbWriter(d))
      .then(d => this.parseDataFromPlc(d));
  }

  //*** Read resolved data from datablock */
  readDataFromPLC(data, dataModel) {
    return this.resolveDataToPlc(data, dataModel)
      .then(d => this.dbReader(d))
      .then(d => this.parseDataFromPlc(d));
  }

  //*** This function convert client data to data acceptable for snap7. Besides client object is passing further for processing */
  private resolveDataToPlc(data, dataModel): Promise<{ dataArr: any, passingData: any }> {
    function recursion(data, dataModel, dataArr = []) {
      Object.keys(data).forEach(dataKey => {
        if (typeof data[dataKey] === "object") {
          return recursion(data[dataKey], dataModel[dataKey], dataArr);
        }
        let helpObj = { ...dataModel[dataKey] };
        if (dataModel[dataKey].hasOwnProperty("value")) {
          helpObj.value = data[dataKey];
          dataArr.push({ ...helpObj });
        }
      });
      return dataArr;
    }
    return Promise.resolve({ dataArr: recursion(data, dataModel), passingData: data });
  }

  //*** Read chosen data from datablock */
  private dbReader(data: { dataArr: any, passingData: any }): Promise<{ dataArr: any, passingData: any }> {
    let createArr = data.dataArr.map(element => readPlcDbValue(element));
    return new Promise((resolve, reject) => {
      this.client.ReadMultiVars((createArr), (err, res) => {
        if (err) return reject(this.snap7Error(err));
        res.forEach((r, index) => {
          data.dataArr[index].value = parseReadResponse(r.Data, data.dataArr[index].type);
          data.dataArr[index].rOk = r.Result === 0;
          data.dataArr[index].wOk = false;
        });
        resolve({ dataArr: data.dataArr, passingData: data.passingData });
      });
    });
  }

  //***memorize remembers the actual value before write.This is ok for 2-level copy */
  private dbWriter(data: { dataArr: any, passingData: any }): Promise<{ dataArr: any, passingData: any }> {
    let createArr = data.dataArr.map(element => writePlcValues(element));
    let memorize = data.dataArr.map(element => Object.assign({}, element));

    return new Promise((resolve, reject) => {
      this.client.WriteMultiVars(createArr, (err, res) => {
        if (err)  return reject(this.snap7Error(err));
        res.forEach((value, index) => {
          data.dataArr[index].wOk = value.Result === 0;
          data.dataArr[index].rOk = false;
          data.dataArr.value = memorize[index].value;
        });
        resolve({ dataArr: data.dataArr, passingData: data.passingData });
      });
    });
  }

  //*** Echo is used for testing when there is no plc. */
  private dbEcho(arr: { dataArr: any, passingData: any }): Promise<{ dataArr: any, passingData: any }> {
    return new Promise((resolve, reject) => {
      resolve(arr);
    });
  }

  //*** Parse data from Plc and assign answer to passingData which is object from client */
  private parseDataFromPlc(data: { dataArr: any, passingData: any }) {
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
    return recursion(data.passingData, data.dataArr);
  }
  private snap7Error(err: any) {
    return { error: 'error', errorNr: err, errorDescription: this.client.ErrorText(err) };
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

