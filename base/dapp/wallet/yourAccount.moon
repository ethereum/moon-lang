renderAddress = zb2rhX8bHJsvCUHjVEkeLynfNunnhHEXaDRokPa55BgE5r88u
{
  name: "wallet-your-account"
  args: {
    address: "0x0000000000000000000000000000000000000000"
  }
  value: my =>
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
        value: (renderAddress (my "address") 8 (div h 8))
      }
      {
        pos: [startX 0]
        size: [(sub w startX) titleH]
        font: {family: "helvetica"}
        value: "Your Account"
      }
      {
        pos: [startX titleH]
        size: [(sub w startX) addressH]
        font: {family: "helvetica"}
        value: (my "address")
      }
    ]
}
