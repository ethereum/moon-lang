my =>
  size = (my "size")
  w = (get size "0")
  h = (get size "1")
  {
    pos: [20 20]
    size: [(sub w 40) 40]
    box: {
      text:{color:"rgb(120,120,120)" style:"italic"}
      unselectable: 1
    }
    value: "Welcome to Moon!"
  }
