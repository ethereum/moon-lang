{
  params: {
    label: "Foo"
    icon: "X"
    active: 1
  }
  value: my =>
    label = (my "label")
    icon = (my "icon")
    active = (my "active")
    {
      name: (con "ethereum-wallet-top-button-" label)
      state: 0
      value: my =>
        pressed = (my "state")
        size = (my "size")
        w = (get size "0")
        h = (get size "1")
        {
          size: size
          box: {
            cursor: "pointer"
            borders: (if active {bottom: {size: 4 style: "solid" color: "rgb(241,241,241)"}} {})
            text: {
              font: "sans-serif"
              color: (if active "rgb(52,133,187)" "rgb(180,167,166)")
            }
            onMouseDown: do => end => (do "setState" (sub 1 pressed) (end 0))
            onMouseUp: do => end => (do "setState" (sub 1 pressed) then => (do "yell" "pressed" then => (end 0)))
          }
          value: [
            {
              pos: (if pressed [0 27] [0 26])
              size: (if pressed [w 27] [w 28])
              box: {text: {align: "center"}}
              value: icon
            }
            {
              pos: (if pressed [0 59] [0 60])
              size: (if pressed [w 12] [w 14])
              box: {text: {align: "center"}}
              value: label
            }
          ]
        }
    }
}
