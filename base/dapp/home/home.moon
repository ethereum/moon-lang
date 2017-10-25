do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX

{
  name: "moon-home"
  value: my =>
    size = (my "size")
    width = (get size "0")
    {
      background: "rgb(120,120,120)"
      value: {
        pos: [20 20]
        size: [(sub width 40) 40]
        font:{
          color:"rgb(250,250,250)"
          style:"italic"
        }
        cursor: "pointer"
        value: "Welcome to Moon!"
      }
    }
}
