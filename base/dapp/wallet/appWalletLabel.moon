{
  params: {
    label: "Label"
    thing: {box:{background:"rgb(200,200,200)"}, value:""}
  }
  value: my =>
    size = (my "size")
    label = (my "label")
    thing = (my "thing")
    w = (get size "0")
    h = (get size "1")
    [
      {
        size: [w 18]
        value: label
      }
      {
        pos: [0 (sub h 30)]
        size: [w 30]
        value: thing
      }
    ]
}
