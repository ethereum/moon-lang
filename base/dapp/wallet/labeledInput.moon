input = zb2rhYQbKusxvwKeH8UER8Wwu6vAAQLC7Z7AU55KiQQ8uESGK
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
{
  name: "labeled-input"
  args: {label:"Label" type:"address" color:"blue"}
  value: my =>
    size = (my "size")
    w = (get size "0")
    h = (get size "1")
    color = (my "color")
    labelBox = {
      pos: [0 0]
      size: [(mul w 0.5) (mul h 0.5)]
      font: {family:"helvetica" weight:"bold" color:color size:(mul h 0.25)}
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
