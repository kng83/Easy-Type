import {PLC} from "./plc-utility/s7.connection";
import {FirstSome} from "./_computed/_datablocks/First.Some";
import {HmiStatsPendolino} from "./_computed/_datablocks/Hmi.Stats.Pendolino";

let newConn = PLC.connect({ip: "172.27.20.214", rackNr: 0, slot: 1});


let db3 = FirstSome;

db3.sssReal.value = 99.0;
db3.char_1.value = "f";
db3.wasyl.int_1.value = 11;
db3.kot_1.item_1.value = 1;


newConn.dbReader([db3.some_Int_1]).then(value => console.log(value, "read")).catch(e => e.message);
db3.some_Int_1.value = 37;
newConn.dbWriter([db3.some_Int_1]).then(value => console.log(value)).catch(e => console.log(e.message));

//***Example of connection to pendolino */
// let newConn = PLC.connect({ip:'172.27.22.200',rackNr:0,slot:2})
//  let db129 = HmiStatsPendolino;
//  newConn.dbReader([db129.HMI_IN.Przejechane_KM]).then((value)=>console.log(value)).catch(err=>console.log(err.message));
