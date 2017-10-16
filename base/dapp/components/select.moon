do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
arrayLength = zb2rhj31DmWEQi2c9stdR1r8wfFboPeFCEdXNysWKikEx3QHy
arrayGet = zb2rhjfCUgfysNDVs2pTuMw9Um8hRbGyYdsjKCaMTceKAGDSG

my =>
  size = (my "size")
  width = (get size "0")
  height = (get size "1")
  {
    state: {index: 0}

    args: {
      options: ["foo" "bar" "baz"]
      arrows: {
        left: {
          font: {align: "center"}
          value: "←"
        }
        right: {
          font: {align: "center"}
          value: "→"
        }
      }
    }

    value: my => 

      options = (my "options")
      selected = (my "index")
      arrows = (my "arrows")

      select = n => 
        len = (arrayLength options)
        nextState = (mod (add (add selected len) n) len)
        (do "set" nextState)>
        (do "yell" nextState)>
        (do "stop")

      leftArrow = {
        pos: [0 0]
        size: [height height]
        cursor: "pointer"
        onClick: (select -1)
        value: (get arrows "left")
      }

      rightArrow = {
        pos: [(sub width height) 0]
        size: [height height]
        cursor: "pointer"
        onClick: (select 1)
        value: (get arrows "right")
      }

      screen = {
        pos: [height 0]
        size: [(sub width (mul height 2)) height]
        value: (arrayGet options selected)
      }

      [
        leftArrow
        screen
        rightArrow
      ]
  }
