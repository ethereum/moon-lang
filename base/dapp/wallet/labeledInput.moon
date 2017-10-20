input = zb2rhgrdmmiCXBSzUqjSbeW7KcCRymXZeC1DHVoJWAJTTmgfk
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
{
  name: "labeled-input"
  args: {label:"Label" type:"address" color:"blue" textColor:"black"}
  value: my =>
    size = (my "size")
    w = (get size "0")
    h = (get size "1")
    color = (my "color")
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
      set: {type:(my "type") color:color}
      borders: {bottom:{size:1 style:"dashed" color:color}}
      value: input
    }
    [labelBox inputBox]
}
