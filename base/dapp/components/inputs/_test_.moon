input = zb2rheNMvxPG25EnpC4yCjHvUMSBLuEckcp2Po5vRTmfWxBqj
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX

my => {
  set: {
    type: "address"
  }
  onHear: value =>
    (do "print" value)>
    (do "stop")
  borders: {
    bottom: {
      size: 1
      style: "dashed"
      color: "rgb(140,180,230)"
    }
  }
  value: input
}
