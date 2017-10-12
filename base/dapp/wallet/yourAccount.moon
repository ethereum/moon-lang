renderAddress = zb2rhe7DnDFA13zHnhUGUjBn7nMuDhyxbdgCds24WnR9Dc2G7
{
  args: {
    address: "0xc7fE03CE5fB8D188554E19E64D34522e77C4e6D4"
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
