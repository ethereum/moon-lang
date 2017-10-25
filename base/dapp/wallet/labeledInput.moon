input = zb2rhfQJvJ1LE6nidV7KNQWUZU331sR98G6Ynv3P4cANjpohv
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
{
  name: "labeled-input"
  args: {label:"Label" type:"address" textColor:"blue"}
  child: my =>
    size = (my "size")
    w = (get size "0")
    h = (get size "1")
    textColor = (my "textColor")
    labelBox = {
      pos: [0 0]
      size: [(mul w 0.5) (mul h 0.5)]
      font: {family:"helvetica" weight:"bold" color:textColor size:(mul h 0.25)}
      child: (my "label")
    }
    inputBox = {
      pos: [0 (mul h 0.5)]
      size: [w (mul h 0.5)]
      set: {type:(my "type") color:textColor}
      borders: {bottom:{size:1 style:"dashed" color:textColor}}
      child: input
    }
    [labelBox inputBox]
}
