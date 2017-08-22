{
  name: "ethereum-wallet-input"
  state: ""
  params: {
    paddings: {}
  }
  value: my =>
    min = a => b => (if (ltn a b) a b)
    size = (my "size")
    text = (my "state")
    w = (get size "0")
    h = (min (get (my "size") "1") 60)
    {
      pos: [0 0]
      size: [w h]
      box: {
        background: "rgb(245,244,242)"
        borders: {bottom: {size: 2, style: "solid", color: "rgb(218,217,216)"}}
      }
      value: [
        {
          pos: [0 (mul h 0.25)]
          size: [w (mul h 0.5)]
          box: {
            input: 1,
            paddings: (my "paddings")
            onKeyUp: e => do => end => 
              text = (get e "text")
              (do "setState" text (do "yell" text (end 0)))
          }
          value: text
        }
      ]
    }
}
