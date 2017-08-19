// Welcome to Moon's reference implementation. Since there is no formal spec
// of the language yet, here is a brief informal but pretty much complete one.
// Moon is, in essence, the lambda-calculus plus JSON and pure JSON-operations.
// Its core language has just 10 constructors.
//
// data MoonTerm
//   = App MoonTerm MoonTerm
//   | Lam MoonTerm
//   | Var Number
//   | Ref String
//   | Let String MoonTerm MoonTerm
//   | Fix String MoonTerm
//   | Pri String [MoonTerm]
//   | Num Number
//   | Str String
//   | Map [[String, MoonTerm]]
// 
// App, Lam, Var are the λ-calculus. Ref is a named free variable. Let binds a
// named variable, Fix is the fixed point, Pri encodes a primitive operation.
// Num, Str and Map hold JSON data. There are 27 primitive ops:
// 
// if  :: Number -> MoonTerm -> MoonTerm
// add :: Number -> Number -> Number
// sub :: Number -> Number -> Number
// mul :: Number -> Number -> Number
// div :: Number -> Number -> Number
// mod :: Number -> Number -> Number
// pow :: Number -> Number -> Number
// log :: Number -> Number -> Number
// ltn :: Number -> Number -> Number
// gtn :: Number -> Number -> Number
// eql :: Number -> Number -> Number
// flr :: Number -> Number
// sin :: Number -> Number
// cos :: Number -> Number
// tan :: Number -> Number
// asn :: Number -> Number
// acs :: Number -> Number
// atn :: Number -> Number
// con :: String -> String -> String
// slc :: String -> Number -> Number -> String
// cmp :: String -> String -> Number
// nts :: Number -> String
// stn :: String -> Number
// gen :: ((String -> a -> Map a) -> Map a -> Map a) -> Map a
// get :: String -> Map a -> Nullable a
// for :: Number -> Number -> st -> (Number -> st -> st) -> st
//
// Most operations are hopefully obvious. `con` is concatenation, `slc` is
// slicing, `cmp` is string equality comparison. `nts` and `stn` converts from
// strings to numbers and back. `gen` generates a Map from its fold. `get` gets
// the value of a key in a map, and may return null.  `for` receives an initial
// index, an exclusive limit, an initial state, a function (that receives the
// index and the current state and returns the next state), and then it returns
// the last state of the loop.
//
// Terms of that ADT are transported using a compact binary format:
//
// App 00 + term + term
// Lam 01 + term
// Var 10 + nat
// Ref 11000 + ref
// Fun 11001 + ref + term
// Let 11010 + ref + term + term
// Fix 11011 + ref + term
// Pri 11100 + prim + terms
// Num 11101 + sign + nat + nat
// Str 11110 + nat + [nat]
// Map 11111 + nat + [str + term]
//
// (TODO: explain more precisely)
"use strict";