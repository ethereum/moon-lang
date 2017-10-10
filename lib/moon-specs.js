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
// if  :: Number -> a -> a -> a                                            -- lazy branching
// add :: Number -> Number -> Number                                       -- addition
// sub :: Number -> Number -> Number                                       -- subtraction
// mul :: Number -> Number -> Number                                       -- multiplication
// div :: Number -> Number -> Number                                       -- division
// mod :: Number -> Number -> Number                                       -- modulus
// pow :: Number -> Number -> Number                                       -- power
// log :: Number -> Number -> Number                                       -- logarithm
// ltn :: Number -> Number -> Number                                       -- less than
// gtn :: Number -> Number -> Number                                       -- greater than
// eql :: Number -> Number -> Number                                       -- number equality
// flr :: Number -> Number                                                 -- floor
// sin :: Number -> Number                                                 -- sine
// cos :: Number -> Number                                                 -- cosine
// tan :: Number -> Number                                                 -- tangent
// asn :: Number -> Number                                                 -- arcsine
// acs :: Number -> Number                                                 -- arccosine
// atn :: Number -> Number                                                 -- arctangent
// con :: String -> String -> String                                       -- concatenation
// slc :: String -> Number -> Number -> String                             -- slicing
// cmp :: String -> String -> Number                                       -- string equality
// nts :: Number -> String                                                 -- number to string
// stn :: String -> Number                                                 -- string to number
// gen :: ((String -> a -> Map a) -> Map a -> Map a) -> Map a              -- generates a map dynamically
// get :: String -> Map a -> a                                             -- map lookup, key *must* be present
// for :: Number -> Number -> state -> (Number -> state -> state) -> state -- loops
// len :: String -> Number                                                 -- string length
// xor :: Number -> Number -> Number                                       -- uint32 bitwise xor
// or  :: Number -> Number -> Number                                       -- uint32 bitwise or
// and :: Number -> Number -> Number                                       -- uint32 bitwise and
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