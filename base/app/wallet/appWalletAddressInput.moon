min = zb2rhcMiWXCWrJDJtYVb6TWVf2YjSq4qy4vcki5uuAF5v4J9j
input = zb2rhXu3yqPyEx5nBKqATrLY8ZYLLqh5HjXQa71TzEzpWBPAa
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
renderAddress = zb2rhcFBqeo5M1gL8sFVuZXcZZmuWHrjpTjuhUDZiZ9oBJtRP

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
        onHear: newAddress => do =>
          (do "setState" newAddress)>
          (do "yell" newAddress)>
          (do "stop")
        value: input
      }
      {
        pos: [0 0]
        size: [h h]
        value: (renderAddress address 8 (div h 8))
      }
    ]
}

