input = zb2rhd3YtZbhHjhYx69SGPnbjVhTDUyWpaPzEHbnmZDZVFJzw
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX

my => {
  set: {
    type: "number"
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
