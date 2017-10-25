do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
join = zb2rhgWm1GQM8ith9EBVJSMxsLAZBzGGsCvgnyaPZHmz3c7ym
hexToDec = zb2rhYSZqJ3v79y8EtvjYBrxMneDd1bF4t7a6BkP4HQVXDkRn
moonImage = zb2rhoEKLUvMk9AMkXCbpxvxVd4BcnrtobP31XggWsLJGvfDi

{
  name: "moon-home"
  title: {
    text: "Hello Moon!"
    background: [0 0 0]
  }
  state: {
    blockNumber: "0"
  }
  onFetch: |
    blockNumber = <(do "eth" ["blockNumber" ["latest"]])
    (do "set" {blockNumber: (hexToDec blockNumber)})>
    (do "stop")
  child: my =>
    w = (get (my "size") "0")
    h = (get (my "size") "1")
    {
      pos: [0 0]
      size: [w h]
      background: moonImage
      child: [
        {
          pos:[0 0]
          size:[w 20]
          font:{color:"rgb(244,220,66)"}
          child:"Hello Moon!"
        }
        {
          pos: [0 20]
          size: [w 20]
          font:{color:"rgb(250,250,250)"}
          child: (join "" ["Block: " (my "blockNumber")])
        }
      ]
    }
}
