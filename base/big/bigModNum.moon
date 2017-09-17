bigQtrNum = zb2rhjyNi921eSUvyyVSpsrYRqPqpNkCeVS9hm871hCqVPSug

// Big -> Uint16 -> Big
// Modulus of Bignum and a single-digit Uint16.
// This is *much* faster than long modulus (for now).
a => b =>
  (get (bigQtrNum a b) "rem")
