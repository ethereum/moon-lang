input = zb2rhji28xSW6ZwBEMRy4T3bvD3TDZh2VCHNzB9wnq7Ahc9Gm
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX

{
  name: "labeled-input"
  args: {
    label: "Label"
    type: "address"
  }
  value: my =>
    size = (my "size")
    w = (get size "0")
    h = (get size "1")
    labelBox = {
      pos: [0 0]
      size: [(mul w 0.5) (mul h 0.5)]
      font: {
        family: "helvetica"
        weight: "bold"
        color: "rgb(73,62,61)"
        size: (mul h 0.25)
      }
      value: (my "label")
    }
    inputBox = {
      pos: [0 (mul h 0.5)]
      size: [w (mul h 0.5)]
      set: {
        type: (my "type")
      }
      borders: {
        bottom: {
          size: 1
          style: "dashed"
          color: "rgb(140,180,230)"
        }
      }
      value: input
    }
    [labelBox inputBox]
}
