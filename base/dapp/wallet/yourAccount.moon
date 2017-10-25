renderAddress = zb2rhdkgwMJAUkUAqX9mcjNCsHx2sSHFrTyz2xiJtReKCQW9J
{
  name: "wallet-your-account"
  args: {
    address: "0x0000000000000000000000000000000000000000"
  }
  child: my =>
    size = (my "size")
    w = (get size "0")
    h = (get size "1")
    titleH = (mul h 0.6)
    addressH = (sub h titleH)
    startX = (add h (mul h 0.2))
    [
      {
        pos: [0 0]
        size: [h h]
        radius: (mul h 0.16)
        child: (renderAddress (my "address") 8 (div h 8))
      }
      {
        pos: [startX 0]
        size: [(sub w startX) titleH]
        font: {family: "helvetica"}
        child: "Your Account"
      }
      {
        pos: [startX titleH]
        size: [(sub w startX) addressH]
        font: {family: "helvetica"}
        selectable: 1
        child: (my "address")
      }
    ]
}
