min = zb2rhcMiWXCWrJDJtYVb6TWVf2YjSq4qy4vcki5uuAF5v4J9j
input = zb2rhj5aJtA5SmuhvSpofhmEgdusQoNopMSSAkZ4oaNh5gGU3
{
  name: "ethereum-wallet-address-input"
  state: ""
  value: my =>
    address = (my "state")
    w = (get (my "size") "0")
    h = (min (get (my "size") "1") 40)
    [
      {
        pos: [h 0]
        size: [(sub w h) h]
        onHear: newAddress => do => end =>
          (do "setState" newAddress then =>
          (do "yell" newAddress then =>
          (end 0)))
        value: input
      }
      {
        pos: [0 0]
        size: [h h]
        background:"rgb(120,120,120)"
        value: ""
      }
    ]
}

