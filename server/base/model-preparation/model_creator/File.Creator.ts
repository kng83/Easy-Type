import fs from "fs";
import {resolve, join, relative} from "path";
import {log} from "../../../config/app.config";


interface Path {
  destPath: string;
  callPath?: string;
}

interface BasicWritingParams {
  fileName: string;
  payload: any;
  payloadWrapper: (exportedName: string, payload: string) => string;
  addImports?: string[];
}

interface BasicWritingParamsAndFilePath extends Path, BasicWritingParams {

}

interface WritingParams extends BasicWritingParamsAndFilePath {
  getActualTimeWithPrefix: (prefix: string) => string;
  getStoredTimeWithPrefix: (filePath: string, prefix: string, timeStampLength: number) => string;
  writeStreamWithTimeStamp: (fullPath: string, actualTimeStamp: string, filePayload: string, imports: string) => void;
  prefix: string;

}

//*** Clear directory from files which are not present in array */
export function variableFileCreatorFactory(enable: string, path: Path, params: BasicWritingParams[]) {

  //Make list of files in folder
  let listOfFiles = params.reduce((acc, current) => {
    return [...acc, current.fileName];
  }, []);
  log.info("File List", listOfFiles);

  //create files to write
  for (let param of params) {
    writeVariableFile(enable, {
      fileName: param.fileName,
      destPath: path.destPath,
      callPath: path.callPath,
      payload: param.payload,
      payloadWrapper: param.payloadWrapper,
      addImports: param.addImports

    });
  }

  //Delete files which aren't on the list
  fs.readdir(path.destPath, (err, files) => {
    files.forEach(file => {
      if (!listOfFiles.includes(file)) {

        let fullPath = path.destPath + "/" + file;
        fs.unlinkSync(fullPath);
        log.info(file + " is deleted");
      }
    });
  });
}

//***Writing single file with payload
function writeVariableFile(enable: any, params: BasicWritingParamsAndFilePath) {
  enable == "true" ? enable = true : enable = false;
  writeFileDueChanges(enable, {
    getActualTimeWithPrefix: getActualTimeWithPrefix,
    getStoredTimeWithPrefix: getStoredTimeWithPrefix,
    destPath: params.destPath,
    callPath: params.callPath,
    fileName: params.fileName,
    prefix: "//#",
    writeStreamWithTimeStamp: writeStreamWithTimeStamp,
    payloadWrapper: params.payloadWrapper,
    payload: params.payload,
    addImports: params.addImports
  });
}

//*** Writing file with payload and resolve
function writeFileDueChanges(enable: boolean, params: WritingParams) {
  if (!enable) return;
  //***Check if fileName is not computed */

  let fullPath = params.destPath + "/" + params.fileName;

  let variableName = getVariableNameFromFile(params.fileName);

  try {
    if (params.getActualTimeWithPrefix(params.prefix) !== params.getStoredTimeWithPrefix(fullPath, params.prefix, 3))
      writeStreamWithTimeStamp(fullPath,
        params.getActualTimeWithPrefix(params.prefix),
        params.payloadWrapper(variableName, params.payload),
        resolveImports(params.addImports, params.destPath, params.callPath)
      );

  } catch (err) {
    console.log("error");
    writeStreamWithTimeStamp(fullPath,
      params.getActualTimeWithPrefix(params.prefix),
      params.payloadWrapper(variableName, params.payload),
      resolveImports(params.addImports, params.destPath, params.callPath));
    return;
  }
}

//*** Write timestamp in first line of file then write payload */
function writeStreamWithTimeStamp(fullPath: string, actualTimeStamp: string, payload: string, imports: string) {
  const stream = fs.createWriteStream(fullPath);
  stream.once("open", fd => {
    stream.write(`${actualTimeStamp}\n`);
    if (imports !== undefined && imports !== null) {
      stream.write(`${imports}`);
    }

    stream.write(`${payload}`);
    stream.end();
  });
}

//***Utilities

//***Resolve imports
//*** Function resolves imports and passes new relative path to file
function resolveImports(importLinks: string[], destPath: string, callDir: string) {
  if (!importLinks) return undefined;

  let totalImport = "";
  let destFullPath = join(process.cwd(), destPath);
  console.log(importLinks);

  importLinks.forEach(importPath => {
    let fromIndex = importPath.search(/\b(from)\b/);
    let retrieveImport = importPath.slice(0, fromIndex + 4);
    let retrievePath = (importPath.slice(fromIndex + 4, importPath.length))
      .trim().replace(/\'/g, "").replace(/\"/g, "");

    let removeDist = callDir.replace("dist", "");
    let changeOutFile = removeDist.replace("out-files", "server");
    let fullImportPath = resolve(changeOutFile, retrievePath);
    let relativePath = relative(destFullPath, fullImportPath).replace(/\\/g, "\/");
    totalImport = `${totalImport}\n ${retrieveImport} \'${relativePath}\'\n\r `;
  });
  return totalImport;
}

//***Making variable name from file name//
function getVariableNameFromFile(fileName: string) {
  let tsIndex = fileName.indexOf(".ts");
  if (tsIndex === -1) throw new Error("Incorrect file extension function getVariableNameFromFile");
  return fileName.slice(0, tsIndex).split(".").join("");
}


//***Making compound prefix with fixed 3 digits time.*/
function getActualTimeWithPrefix(prefix: string): string {
  let date = new Date();
  return prefix.concat((date.getMinutes() * 10 + Math.floor(date.getSeconds() / 10) + 100).toString());
}

//***Take prefix stored in file
function getStoredTimeWithPrefix(filePath: string, prefix: string, timeStampLength: number): string {
  return fs.readFileSync(filePath, {encoding: "utf8"}).slice(0, timeStampLength + prefix.length);
}
