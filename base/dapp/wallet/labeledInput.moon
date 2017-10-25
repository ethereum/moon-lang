input = zb2rhdXL1cmQuVj4uSi9VT4Au1Z1fUxA1xc47kuuA4fbYfkt2
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
{
  name: "labeled-input"
  args: {label:"Label" type:"address" textColor:"blue"}
  value: my =>
    size = (my "size")
    w = (get size "0")
    h = (get size "1")
    textColor = (my "textColor")
    labelBox = {
      pos: [0 0]
      size: [(mul w 0.5) (mul h 0.5)]
      font: {family:"helvetica" weight:"bold" color:textColor size:(mul h 0.25)}
      value: (my "label")
    }
    inputBox = {
      pos: [0 (mul h 0.5)]
      size: [w (mul h 0.5)]
      set: {type:(my "type") color:textColor}
      borders: {bottom:{size:1 style:"dashed" color:textColor}}
      value: input
    }
    [labelBox inputBox]
}
