bigQtrNum = zb2rhmNLxRXARDMEjT6DcBFMWenraake4u3vv6cWXG1FBssk1

// Big -> Uint16 -> Big
// Divides a Bignum by a single-digit Uint16.
// This is *much* faster than long division (for now).
a => b =>
  (get (bigQtrNum a b) "quo")
