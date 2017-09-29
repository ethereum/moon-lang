abi = zb2rhfPmLEtKPYgLsYELg1uhkTab7a63vks4WgwGRc5S9MbPQ
encode = (abi "encode")
type = (abi "parseType") 
big = zb2rhnKgZ66iwb9AGyxTMP6zPbkwxe5jKxrKYTofJqisdhfJU

{
  baz: (encode 1 [
    [(type "uint256") (big "69")]
    [(type "uint256") (big "1")]
  ])

  sam: (encode 1 [
    [(type "bytes") "0x64617665"]
    [(type "uint256") (big "1")]
    [(type "uint256[]") [(big "1") (big "2") (big "3")]]
  ])

}
