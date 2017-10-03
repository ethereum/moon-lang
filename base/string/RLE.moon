listFold = zb2rhbksBjR3yFP98YrEGss6Yv7wVCgNbYtWiwz9nGRSAoiAa
listVal = zb2rhcXRC5mtMz8yYiWuZourtH3MaZwx4m3VfDRPvvFkwpbFh
listEnd = zb2rhbQFhrUA2SqQVKweLeRoHomXzJwAsKLtKT2TjW7Eunk6x
listHas = zb2rhiqUGZDZXG5CSSG4fZg2ZK7gWWfeFLkJk7mzo64recaKk
repeat = zb2rhhLQXrHR8hDZtEAJR91FZJP3THHjWsz2yhUoRYLPYWNAT
stringToList = zb2rhaf52QPhvWDEJyMYJ4AP63uiGR4uknaDwJkCHuDB4g19D
listToString = zb2rhi99gx1g54f7joND8PaPQMy4Emg7NdfSL1bThusxym2sy

// [Char]
//   The church-list of numeric chars, (v => e => (v "0" (v "1" ... e)))
nums = (stringToList "0123456789")

// Char -> Number
//   Checks if a char is numeric. Note: Usage of `#` expands it to `a => (if
//   (cmp a "0") 1 (if (cmp a "1") 1 ...))` at compile-time, so this doesn't
//   use lists at runtime and is very fast.
isNum = # char =>
  (listHas (cmp char) nums)

// String -> String
//   Decodes a RLE-encoded string.
decode = str =>

  // Converts the string to a church-encoded list of chars
  list = (stringToList str)

  // The recursive algorithm using fold
  fold = (listFold list {

    // Empty case: returns empty list
    end: num => listEnd

    // Cons case:
    // - If numeric char: sends the number down the fold
    // - If stringy char: appends the string n times to the result
    val: x => xs => num =>
      (if (isNum x)
        (xs (con x num))
        (repeat (stn num) (listVal x) (xs "")))

  })

  // Starts the algorithm with an empty number
  // Converts the resulting list back to a string
  (listToString (fold ""))


// String -> String
//   Encodes a string with the RLE.
encode = chars =>

  // Converts the string to a church-encoded list of chars
  list = (stringToList chars)

  // The recursive algorithm using fold
  fold = (listFold list {

    // Empty case: returns empty list
    end: last => i =>
      (listVal (nts i) (listVal last listEnd))

    // Cons case:
    // - If last char == this char: adds 1 to counter, pass it down the fold
    // - If not:
    //   - If there is a last char: appends count + char to result, continues fold with new char
    //   - Else: continues fold with new char
    val: x => xs => last => i =>
      (if (cmp last x)
        (xs last (add i 1))
        (if (len last)
          (listVal (nts i) (listVal last (xs x 1)))
          (xs x 1)))

  })

  // Starts the algorithm with no char
  // Converts the resulting list back to a string
  (listToString (fold "" 1))

{
  encode: encode
  decode: decode
}
