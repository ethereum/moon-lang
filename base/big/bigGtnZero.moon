listFold = zb2rhbksBjR3yFP98YrEGss6Yv7wVCgNbYtWiwz9nGRSAoiAa

big =>
  (listFold big {
    val: x => xs => (if (gtn x 0) 1 xs)
    end: 0
  })
