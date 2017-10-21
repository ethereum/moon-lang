input = zb2rhdXL1cmQuVj4uSi9VT4Au1Z1fUxA1xc47kuuA4fbYfkt2
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
