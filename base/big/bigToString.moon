bigToBase = zb2rhXw8GVBqpjKN3jK8x4eVHUUNZPvnyjqRnpa1yqeL1jCVm
numToChr = zb2rhaZ9TTk7YhXWSeue3gNgdJ9AJfMvgdDa5hBfBuXodafPs
listFold = zb2rhbksBjR3yFP98YrEGss6Yv7wVCgNbYtWiwz9nGRSAoiAa

// Number(2~36) -> BigNum -> String
base => big =>
  (listFold (bigToBase base big) {
    val: digit => result => (con (numToChr digit) result)
    end: ""
  })
