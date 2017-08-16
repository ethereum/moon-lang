{
  type: "app",
  name: "mist",
  state: 0,
  render: env. state. 
    incCounter: (io (ioSetState (add 1 state) x. ioEnd))
    {
      type: "box"
      area: [0 0 (env "width") (env "height")]
      unselectable: 1
      children: [
        {
          type: "box"
          area: [10 10 200 40]
          onClick: incCounter
          children: [
            {
              type: "str",
              value: "Welcome to Mist!"
            }
          ]
        }
        {
          type: "box"
          area: [10 40 200 40]
          onClick: incCounter
          children: [
            {
              type: "str",
              value: (arrayJoin " " [
                "You clicked:"
                (numberToString state)
                "times!"
              ])
            }
          ]
        }
      ]
    }
}
