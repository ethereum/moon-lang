{
  name: "moon-home"
  value: my =>
    size = (my "size")
    width = (get size "0")
    titleWidth = (sub width 40)
    titleHeight = 40
    {
      pos: [20 20]
      size: [titleWidth titleHeight]
      font:{
        color:"rgb(120,120,120)"
        style:"italic"
      }
      unselectable: 1
      value: "Welcome to Moon!"
    }
}
