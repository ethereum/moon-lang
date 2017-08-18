const find = require("./moon-util").find;

const termCompileFast = term => {
  const toJS = term => term({
    App: (f, x) => _ => f() + "(" + x() + ")",
    Lam: (name, body) => self => {
      return self
        ? "(function _"+self+"(_"+name+"){return "+body()+"})"
        : "(_"+name+"=>"+body()+")";
    },
    Var: name => _ => "_"+name,
    Ref: name => _ => "_"+name,
    Let: (name, term, body) => _ => {
      var t = term();
      var b = body();
      if (/^\(\(\)=>{/.test(b)) {
        return "(()=>{var _"+name+"="+t+";"+b.slice(6);
      } else {
        return "(()=>{var _"+name+"="+t+";return "+b+"})()";
      }
    },
    Fix: (name, body) => _ => body(name),
    Pri: (name, args) => _ => pri[name][3](...(args.map(a => a()))),
    Num: num => _ => JSON.stringify(num),
    Str: str => _ => JSON.stringify(str),
    Map: kvs => _ => "({"+kvs.map(([k,v]) => '"'+k+'"'+":"+v()).join(",")+"})"
  })();
  return "(()=>{"
    + "\"use strict\";"
    + "var "+commonLib.join(",")+";"
    + "return "+toJS(term)
    + "})";
};

const termDecompileFast = func => {
  try {
    const fromJS = (value) => {
      if (typeof value === "object") {
        return T => {
          var kvs = [];
          for (var key in value)
            kvs.push([key, fromJS(value[key])(T)]);
          return T.Map(kvs);
        }
      } else if (typeof value === "string") {
        return T => T.Str(value)
      } else if (typeof value === "number") {
        return T => T.Num(value);
      }
    }
    return fromJS(func);
  } catch (e) {
    throw new Error("Couldn't reduce term on fast mode.");
  }
}

const termReduceFast = term =>
  termDecompileFast(eval(termCompileFast(term))());

const termCompileFull = term => {
  const toJS = term => term({
    App: (f, x) => "$A("+f+","+x+")",
    Lam: (name, body) => "(_"+name+"=>"+body+")",
    Var: (name) => "_"+name,
    Ref: (name) => "$D('"+name+"')",
    Let: (name, term, body) => /^\(\(\)=>{/.test(body)
      ? "(()=>{var _"+name+"="+term+";"+body.slice(6)
      : "(()=>{var _"+name+"="+term+";return "+body+"})()",
    Fix: (name, body) => "(_"+name+"=>(_"+name+"="+body+",_"+name+"))()",
    Pri: (name, xs) => "$"+pri[name][0]+"("+xs.map((o,i)=>pri[name][0]==="if"&&i?"()=>"+o:o).join(",")+")",
    Num: n => JSON.stringify(n),
    Str: s => JSON.stringify(s),
    Map: map => "({"+map.map(([k,v]) => '"'+k+'"'+":"+v).join(",")+"})"
  });
  var compiled = "(()=>{"
    + "\"use strict\";"
    + "var $P=((a)=>(a.__=1,a));"
    + "var $D=(a)=>$P(['ref',a]);"
    + "var $A=(a,b)=>typeof a==='function'?a(b):$P(['app',a,b]);"
    + "var "+commonLib.join(",")+","
    + pris.map(pri => "$"+pri[0]+"="+pri[2]).join(",")+";"
    + "return "+toJS(term)+"})";
  return compiled;
};

const termDecompileFull = func => (function fromJS(value){
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const name = n => n > 26 ? chars[n % 26] + name(n / 26 | 0) : chars[n];
  return (function nf(value, depth){
    const App = x => (x.isApp = true, x);
    const app = f => App(x => x === null ? f : app(d => T => T.App(f(d)(T), nf(x,d)(T))));
    if (value.isApp) {
      return value(null)(depth);
    } else if (typeof value === "number") {
      return T => T.Num(value);
    } else if (typeof value === "string") {
      return T => T.Str(value);
    } else if (typeof value === "function") {
      return T => T.Lam(name(depth), nf(value(app(d => T => T.Var(name(depth)))), depth+1)(T));
    } else if (value[0] === "ref") {
      return T => T.Var(value[1]);
    } else if (value[0] === "app") {
      return T => T.App(nf(value[1],depth)(T),nf(value[2],depth)(T));
    } else if (pri.hasOwnProperty(value[0])) {
      return T => T.Pri(value[0], value.slice(1).map(value => nf(value, depth)(T)));
    } else if (typeof value === "object") {
      return T => {
        var kvs = [];
        for (var key in value)
          kvs.push([key, nf(value[key], depth)(T)]);
        return T.Map(kvs);
      };
    } else {
      return value;
    }
  })(value, 0);
})(func);

const termReduceFull = term =>
  termDecompileFull(eval(termCompileFull(term))());

const termReduce = term => T => {
  try {
    return termReduceFast(term)(T);
  } catch (e) {
    try {
      return termReduceFull(term)(T);
    } catch (e) {
      throw "No normal form: " + e;
    }
  }
};

const commonLib = [
  "$F=(a)=>typeof a===\"function\"?1:0",
  "$S=(a)=>typeof a===\"string\"?1:0",
  "$N=(a)=>typeof a===\"number\"?1:0",
  "$O=(a)=>typeof a===\"object\"&&!a.__?1:0",
  "$U=undefined",
  "$V=undefined"
];

// TODO: make a proper file to avoid repetition of this on other files
const pris = [
  ["if" , 3, "(a,b,c)=>$N(a)?(a?b():c()):$P(['if',a,b(),c()])", (a,b,c)=>"("+a+"?"+b+":"+c+")"],
  ["add", 2, "(a,b)=>$N(a)&&$N(b)?a+b:$P(['add',a,b])", (a,b)=>"("+a+"+"+b+")"],
  ["sub", 2, "(a,b)=>$N(a)&&$N(b)?a-b:$P(['sub',a,b])", (a,b)=>"("+a+"-"+b+")"],
  ["mul", 2, "(a,b)=>$N(a)&&$N(b)?a*b:$P(['mul',a,b])", (a,b)=>"("+a+"*"+b+")"],
  ["div", 2, "(a,b)=>$N(a)&&$N(b)?a/b:$P(['div',a,b])", (a,b)=>"("+a+"/"+b+")"],
  ["mod", 2, "(a,b)=>$N(a)&&$N(b)?a%b:$P(['mod',a,b])", (a,b)=>"("+a+"%"+b+")"],
  ["pow", 2, "(a,b)=>$N(a)&&$N(b)?Math.pow(a,b):$P(['pow',a,b])", (a,b)=>"Math.pow("+a+","+b+")"],
  ["log", 2, "(a,b)=>$N(a)&&$N(b)?Math.log(b)/Math.log(a):$P(['log',a,b])", (a,b)=>"Math.log("+b+")/Math.log("+a+")"],
  ["ltn", 2, "(a,b)=>$N(a)&&$N(b)?(a<b?1:0):$P(['ltn',a,b])", (a,b)=>"("+a+"<"+b+"?1:0)"],
  ["gtn", 2, "(a,b)=>$N(a)&&$N(b)?(a>b?1:0):$P(['gtn',a,b])", (a,b)=>"("+a+">"+b+"?1:0)"],
  ["eql", 2, "(a,b)=>$N(a)&&$N(b)?(a===b?1:0):$P(['eql',a,b])", (a,b)=>"("+a+"==="+b+"?1:0)"],
  ["flr", 1, "(a)=>$N(a)?Math.floor(a):$P(['flr',a])", (a)=>"Math.floor("+a+")"],
  ["sin", 1, "(a)=>$N(a)?Math.sin(a):$P(['sin',a])", (a)=>"Math.sin("+a+")"],
  ["cos", 1, "(a)=>$N(a)?Math.cos(a):$P(['cos',a])", (a)=>"Math.cos("+a+")"],
  ["tan", 1, "(a)=>$N(a)?Math.tan(a):$P(['tan',a])", (a)=>"Math.tan("+a+")"],
  ["asn", 1, "(a)=>$N(a)?Math.asin(a):$P(['asn',a])", (a)=>"Math.asin("+a+")"],
  ["acs", 1, "(a)=>$N(a)?Math.acos(a):$P(['acs',a])", (a)=>"Math.acos("+a+")"],
  ["atn", 1, "(a)=>$N(a)?Math.atan(a):$P(['atn',a])", (a)=>"Math.atan("+a+")"],
  ["con", 2, "(a,b)=>$S(a)&&$S(b)?a+b:$P(['con',a,b])", (a,b)=>"("+a+"+"+b+")"],
  ["slc", 3, "(a,b,c)=>$S(a)&&$N(b)&&$N(c)?a.slice(b,c):$P(['slc',a,b,c])", (a,b,c)=>a+".slice("+b+","+c+")"],
  ["cmp", 2, "(a,b)=>$S(a)&&$S(b)?(a===b?1:0):$P(['cmp',a,b])", (a,b)=>a+"==="+b],
  ["nts", 1, "(a)=>$N(a)?String(a):$P(['nts',a])", (a)=>"String("+a+")"],
  ["stn", 1, "(a)=>$S(a)?Number(a):$P(['stn',a])", (a)=>"Number("+a+")"],
  ["gen", 1, "(f,_)=>f(k=>v=>a=>(!$S(k)||!$O(a)?$P(['gen',f]):(a[k]=v,a)))({})", (f)=>f+"(k=>v=>a=>(a[k]=v,a))({})"],
  ["get", 2, "(a,k)=>$O(a)&&$S(k)?(($V=a[k])!==$U?$V:null):$P(['get',a,k])", (a,k,d)=>"(($V="+a+"["+k+"])!==$U?$V:"+d+")"],
  ["for", 4, "(a,b,c,d)=>{if($N(a)&&$N(b)&&$F(d)){while(a<b)c=d(a++)(c);return c};return $P(['for',a,b,c,d]);}",
    (i,j,x,f)=>"((i,j,x,f)=>{f="+f+";x="+x+";for(i="+i+",j="+j+";i<j;++i){x=f(i)(x);};return x;})()"]
];

const pri = pris.reduce((pris, pri) => (pris[pri[0]] = pri, pris), {});

module.exports = {
  termCompileFast,
  termDecompileFast,
  termReduceFast,
  termCompileFull,
  termDecompileFull,
  termReduceFull,
  termReduce
};
