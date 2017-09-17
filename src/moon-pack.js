const termToBinary = term => {
  const encodeStr = (str) => {
    const len = encodeNat(str.length);
    const nats = str.split("").map(c => encodeNat(c.charCodeAt(0))).join("");
    return len + nats;
  }
  const encodeRef = (ref) => {
    var str = "";
    for (var i = 0; i < ref.length; ++i) {
      str += refs[ref[i]];
    }
    return str + "000000";
  }
  const encodeNat = (nat) => {
    var bits = (nat + 2).toString(2).slice(1);
    for (var i = 0, chunks = bits.length; i < chunks; ++i)
      bits = (i === 0 ? "0" : "1") + bits;
    return bits;
  }
  const encodeNum = (num) => {
    var exp = 0;
    var sgn = 0;
    var man = 0;
    var esg = 0;
    if (num !== 0) {
      if (num<0) sgn=1, num=-num;
      while (num>2) num/=2, exp++;
      while (num<1) num*=2, exp--;
      while (num!==0) man=man*2+(num|0), num=(num-(num|0))*2;
    }
    if (exp<0) esg=1, exp=-exp;
    return String(sgn) + encodeNat(man) + String(esg) + encodeNat(exp);
  }
  return term({
    App: (f, x) => (S,d) => "00" + f(S) + x(S),
    Lam: (name, body) => (S,d) => {
      if (name === "v" + d) {
        return "01" + body([name,S], d+1);
      } else {
        return "11001" + encodeRef(name) + body([name,S], d+1);
      }
    },
    Var: (name) => (S,d) => {
      var find = (S) => !S ? (()=>{throw ""})() : S[0] === name ? 0 : 1 + find(S[1]);
      return "10" + encodeNat(find(S));
    },
    Ref: (name) => (S,d) => "11000" + encodeRef(name),
    Let: (name, term, body) => (S,d) => "11010" + encodeRef(name) + term(S,d) + body([name,S],d+1),
    Fix: (name, term) => (S,d) => "11011" + encodeRef(name) + term([name,S],d+1),
    Pri: (name, args) => (S,d) => "11100" + priBits[name] + args.map(arg => arg(S,d)).join(""),
    Num: (num) => (S,d) => "11101" + encodeNum(num),
    Str: (str) => (S,d) => "11110" + encodeStr(str),
    Map: (kvs) => (S,d) => "11111" + encodeNat(kvs.length) + kvs.map(([k,v]) => encodeStr(k) + v(S,d)).join("")
  })(null,0);
};

const termFromBinary = src => {
  var idx = 0;
  const parseStr = () => {
    var len = parseNat();
    var nats = [];
    for (var j = 0; j < len; ++j)
      nats.push(parseNat());
    return nats.map(n => String.fromCharCode(n)).join("");
  };
  const parseRef = () => {
    var ref = "";
    while (src.slice(idx, idx += 6) !== "000000") {
      ref += refs[src.slice(idx - 6, idx)];
    }
    return ref;
  };
  const parseNat = () => {
    for (var chunks = 0; src[chunks++, idx++] !== "0";){};
    return parseInt("1" + src.slice(idx, idx += chunks), 2) - 2;
  }
  const head = (head) => {
    if (src.slice(idx, idx + head.length) === head) {
      idx += head.length;
      return true;
    }
    return false;
  }
  const parseTerm = (S, d) => {
    if (head("00")) {
      var f = parseTerm(S, d);
      var x = parseTerm(S, d);
      return T => T.App(f(T), x(T));
    } else if (head("01")) {
      var body = parseTerm(["v"+d,S], d+1);
      return T => T.Lam("v"+d, body(T));
    } else if (head("10")) {
      var i = parseNat();
      for (var k = 0; k < i; ++k)
        S = S[1];
      return T => T.Var(S[0]);
    } else if (head("11000")) {
      var name = parseRef();
      return T => T.Ref(name);
    } else if (head("11001")) {
      var name = parseRef();
      var body = parseTerm([name,S], d+1);
      return T => T.Lam(name, body(T));
    } else if (head("11010")) {
      var name = parseRef();
      var term = parseTerm(S, d);
      var body = parseTerm([name,S], d+1);
      return T => T.Let(name, term(T), body(T));
    } else if (head("11011")) {
      var name = parseRef();
      var body = parseTerm([name,S], d+1);
      return T => T.Fix(name, body(T));
    } else if (head("11100")) {
      var pri = bitsPri[src.slice(idx, idx += 5)];
      var args = [];
      for (var i = 0; i < priArity[pri]; ++i)
        args.push(parseTerm(S, d));
      return T => T.Pri(pri, args.map(a => a(T)));
    } else if (head("11101")) {
      var sgn = src[idx++] === "0" ? 1 : -1;
      var man = parseNat();
      var esg = src[idx++] === "0" ? 1 : -1;
      var exp = parseNat();
      while (man>2) man/=2; 
      return T => T.Num(sgn * man * Math.pow(2, esg * exp));
    } else if (head("11110")) {
      var str = parseStr();
      return T => T.Str(str);
    } else if (head("11111")) {
      var len = parseNat();
      var kvs = [];
      for (var i = 0; i < len; ++i)
        kvs.push([parseStr(d), parseTerm(S, d)]);
      return T => T.Map(kvs.map(([k,v]) => [k,v(T)]));
    }
  };
  return parseTerm(null, 0);
};

const termToHex = term => {
  var binary = termToBinary(term);
  var hex = "";
  for (var i = 0; i < binary.length; i += 4) {
    var bits = binary.slice(i,i+4);
    while (bits.length < 4)
      bits = bits + "0";
    hex += parseInt(bits, 2).toString(16);
  }
  if (hex.length % 2 !== 0)
    hex += "0";
  return "0x" + hex;
};

const termFromHex = bytes => {
  var binary = "";
  for (var i = 2; i < bytes.length; ++i)
    binary += ("0000"+parseInt(bytes[i], 16).toString(2)).slice(-4);
  return termFromBinary(binary);
};

const refs = (() => {
  var refs = {};
  " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_".split("").forEach((chr, idx) => {
    var bin = ("000000" + idx.toString(2)).slice(-6);
    refs[bin] = chr;
    refs[chr] = bin;
  });
  return refs;
})();

const pris = [
  ["if" , "00000"],
  ["add", "00001"],
  ["sub", "00010"],
  ["mul", "00011"],
  ["div", "00100"],
  ["mod", "00101"],
  ["pow", "00110"],
  ["log", "00111"],
  ["ltn", "01000"],
  ["gtn", "01001"],
  ["eql", "01010"],
  ["flr", "01011"],
  ["sin", "01100"],
  ["cos", "01101"],
  ["tan", "01110"],
  ["asn", "01111"],
  ["acs", "10000"],
  ["atn", "10001"],
  ["con", "10010"],
  ["slc", "10011"],
  ["cmp", "10100"],
  ["nts", "10101"],
  ["stn", "10110"],
  ["gen", "10111"],
  ["get", "11000"],
  ["for", "11010"],
  ["len", "11011"],
  ["and", "11100"],
  ["or", "11101"],
  ["xor", "11110"]
];

const priArity = {
  "if": 3,
  "add": 2,
  "sub": 2,
  "mul": 2,
  "div": 2,
  "mod": 2,
  "pow": 2,
  "log": 2,
  "ltn": 2,
  "gtn": 2,
  "eql": 2,
  "flr": 1,
  "sin": 1,
  "cos": 1,
  "tan": 1,
  "asn": 1,
  "acs": 1,
  "atn": 1,
  "con": 2,
  "slc": 3,
  "cmp": 2,
  "nts": 1,
  "stn": 1,
  "gen": 1,
  "get": 2,
  "for": 4,
  "len": 1,
  "and": 2,
  "or": 2,
  "xor": 2
};

const priBits = pris.reduce((pris, pri) => (pris[pri[0]] = pri[1], pris), {});
const bitsPri = pris.reduce((pris, pri) => (pris[pri[1]] = pri[0], pris), {});

module.exports = {
  termToHex,
  termFromHex
};
