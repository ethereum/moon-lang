min = zb2rhcMiWXCWrJDJtYVb6TWVf2YjSq4qy4vcki5uuAF5v4J9j
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
{
  name: "primitive-input"
  state: {text:""}
  args: {
    paddings: size => {}
    font: size => {color:"rgb(160,148,148)" size:(mul (get size "1") 0.8)}
    disabled: 0
  }
  value: my =>
    size = (my "size")
    w = (get size "0")
    h = (get (my "size") "1")
    text = (my "text")
    type = (my "type")
    disabled = (my "disabled")
    placeholder = (my "placeholder")
    {
      pos: [0 0]
      size: [w h]
      input: 1
      type: type
      selectable: 1
      disabled: disabled
      paddings: (my "paddings" size)
      font: (my "font" size)
      onKeyUp: event =>
        text = (get event "text")
        (do "set" {text:text})>
        (do "yell" text)>
        (do "stop")
      value: text
      placeholder: placeholder
    }
}
