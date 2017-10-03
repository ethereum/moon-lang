bigQtrNum = zb2rhmNLxRXARDMEjT6DcBFMWenraake4u3vv6cWXG1FBssk1

// Big -> Uint16 -> Big
// Modulus of Bignum and a single-digit Uint16.
// This is *much* faster than long modulus (for now).
a => b =>
  (get (bigQtrNum a b) "rem")
