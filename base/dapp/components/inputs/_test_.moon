input = zb2rhfQJvJ1LE6nidV7KNQWUZU331sR98G6Ynv3P4cANjpohv
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
  child: input
}
