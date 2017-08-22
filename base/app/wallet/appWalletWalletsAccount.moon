emojiOf = zb2rhdjiBvMfHkm4ewHPkodmJJ5i87c85Q2w9SXs9nykkHrYm

{
  params: {
    name: "Account"
    address: "0x0000000000000000000000000000000000000000"
    balance: 0
  }
  value: my =>
    address = (my "address")
    name = (my "name")
    balance = (my "balance")
    {
      box: {
        cursor: "pointer"
        text:{font:"helvetica"}
      }
      value: 
        [
          {
            pos: [5 0]
            size: [50 75]
            box: {
              text: {size:36 align:"center"}
              paddings: {top: 4}
            }
            value: (emojiOf address)
          }
          {
            pos: [58 6]
            size: [320 20]
            box: {
              text: {
                shadow: {pos:[0 0] blur:0 color:"rgb(42,162,236)"}
                color:"transparent"
              }
            }
            value: [(con name " 🔑")]
          }
          {
            pos: [58 29]
            size: [120 22]
            box: {text:{weight:300 color:"rgb(120,120,120)"}}
            value: (if (eql balance 0) "0.00000000" (slc (nts balance) 0 10))
          }
          {
            pos: [166 36]
            size: [46 13]
            box: {text:{weight:300 color:"rgb(120,120,120)"}}
            value: "ether"
          }
          {
            pos: [58 56]
            size: [320 14]
            box: {text:{weight:300 color:"rgb(180,180,180)"} selectable:1}
            value: address
          }
        ]
    }
}
