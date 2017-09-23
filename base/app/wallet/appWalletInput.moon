min = zb2rhcMiWXCWrJDJtYVb6TWVf2YjSq4qy4vcki5uuAF5v4J9j

{
  name: "ethereum-wallet-input"
  state: ""
  params: {}
  value: my =>
    size = (my "size")
    text = (my "state")
    type = (my "type")
    w = (get size "0")
    h = (min (get (my "size") "1") 40)
    {
      pos: [0 0]
      size: [w h]
      borders: {
        bottom: {size: 1, style: "dashed", color: "rgb(140,180,230)"}
      }
      value: {
        pos: [0 (mul h 0.25)]
        size: [w (mul h 0.5)]
        input: 1
        type: type
        paddings: {left:8, right:8}
        font: {
          color: "rgb(160,148,148)"
          size: 16
        }
        onKeyUp: event => do => end => 
          text = (get event "text")
          (do "setState" text then => (do "yell" text then => (end 0)))
        value: text
      }
    }
}
