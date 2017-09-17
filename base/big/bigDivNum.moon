bigQtrNum = zb2rhjyNi921eSUvyyVSpsrYRqPqpNkCeVS9hm871hCqVPSug

// Big -> Uint16 -> Big
// Divides a Bignum by a single-digit Uint16.
// This is *much* faster than long division (for now).
a => b =>
  (get (bigQtrNum a b) "quo")
