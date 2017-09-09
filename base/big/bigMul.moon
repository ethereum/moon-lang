listToArray = zb2rhgV8FTZ5RDjzugq2CUjVchGzePkQSQuqXvGuDtHgP7aaK

aList => bList =>
  md = (pow 2 16)
  a = (listToArray aList)
  b = (listToArray bList)
  al = (get a "length")
  bl = (get b "length")
  ini = {car:0 res:c=>n=>n}
  res = (for 0 (add al bl) ini i => state =>
    car = (get state "car")
    res = (get state "res")
    sum = (for 0 bl 0 j => sum =>
      n = (sub i j)
      m = (sub (sub bl j) 1)
      x = (if (ltn n 0) 0 (if (ltn n al) (get a (nts n)) 0))
      y = (get b (nts j))
      (add (mul x y) sum))
    tot = (add sum car)
    {
      car: (flr (div tot md))
      res: c => n => (res c (c (mod tot md) n))
    })
  (get res "res")

// algorithm:
// 
// a = 23958233
// b = 5830
// c = a * b
// 
// 00023958233000
//           0385   0  + 0   + 0   + 0  = 0
//          0385    0  + 9   + 0   + 0  = 9
//         0385     0  + 9   + 24  + 0  = 3 ~3
//        0385      0  + 6   + 24  + 15 = 8 ~4
//       0385       0  + 24  + 16  + 15 = 9 ~5
//      0385        0  + 15  + 64  + 10 = 4 ~9
//     0385         0  + 27  + 40  + 40 = 6 ~11
//    0385          0  + 9   + 72  + 25 = 7 ~11
//   0385           0  + 6   + 24  + 45 = 6 ~8
//  0385            0  + 0   + 16  + 15 = 9 ~3
// 0385             0  + 0   + 0   + 10 = 3 ~1
// 
// c = 139676498390
// 
// Slower version:
// f = a => b =>
//   md = (pow 2 16)
//   ( 
//     c => n => (a c (b (h => (c 0)) n))
//     a => as => state =>
//       car0 = (get state "car")
//       res0 = (get state "res")
//       aas0 = (get state "aas")
//       aas1 = c => n => (c a aas0)
//       prod = (add car0 (b y => ys => a => (a x => xs => (add (mul x y) (ys xs)) 0) a => 0 aas1))
//       car1 = (flr (div prod md))
//       res1 = c => n => (res0 c (c (mod prod md) n))
//       (as {car:car1 res:res1 aas:aas1})
//     state =>
//       car = (get state "car")
//       res = (get state "res")
//       (if car (c => n => (c car (res c n))) res)
//     {car:0 res:c=>n=>n aas:c=>n=>n})
