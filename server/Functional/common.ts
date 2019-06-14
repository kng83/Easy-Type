
  export let match = (reg) => (val:string)=> val.match(reg);
  export let prop= (prop:any) =>(val) => val[prop];
  export let add = (add:any) => (val:any) => val + add;
  export let toUpper= (val: string) => val.toString().toUpperCase();
  export let strAdd =  (addString:string)=> (val) => addString + val;
  export let identity = x=>x;
  export let tap = (val:any)=>{console.log(val);return val;}