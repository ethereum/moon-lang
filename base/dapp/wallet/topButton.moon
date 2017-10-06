{
  args: {
    label: "Foo"
    icon: "X"
    active: 1
  }
  value: my =>
    label = (my "label")
    icon = (my "icon")
    active = (my "active")
    {
      name: (con "wallet-top-button-" label)
      state: 0
      value: my =>
        pressed = (my "state")
        size = (my "size")
        w = (get size "0")
        h = (get size "1")
        {
          size: size
          cursor: "pointer"
          borders: (if active {bottom: {size: 4 style: "solid" color: "rgb(241,241,241)"}} {})
          font: {
            family: "helvetica"
            color: (if active "rgb(52,133,187)" "rgb(180,167,166)")
          }
          onMouseDown: do => (do "setState" (sub 1 pressed) (do "stop"))
          onMouseUp: do => (do "setState" (sub 1 pressed) then => (do "yell" "pressed" then => (do "stop")))
          value: [
            {
              pos: (if pressed [0 27] [0 26])
              size: (if pressed [w 44] [w 46])
              font: {align: "center"}
              value: icon
            }
            {
              pos: (if pressed [0 79] [0 80])
              size: (if pressed [w 17] [w 18])
              font: {align: "center"}
              value: label
            }
          ]
        }
    }
}
