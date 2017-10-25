//do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
hexToDec = zb2rhYSZqJ3v79y8EtvjYBrxMneDd1bF4t7a6BkP4HQVXDkRn
moonImage = zb2rhbEccKnwdnXWDLyMhMi2UrGdFpXtpLX9Trdx1fKzf8rbF
{
  name: "moon-home"
  title: {
    text:"Hello, Moon!"
    background:"rgb(0,0,0)"
  }
  state: {
    blockNumber: "0"
  }
  onFetch: |
    blockNumber = <(do "eth" ["blockNumber" ["latest"]])
    (do "set" {blockNumber: (hexToDec blockNumber)})>
    (do "stop")
  child: my =>
    size = (my "size")
    width = (get size "0")
    height = (get size "1")
    [
      {
        pos: [0 0]
        size: [width height]
        background: "rgb(0,0,0)"
      }
      {
        pos: [20 20]
        size: [90 40]
        font: {color:"rgb(250,250,250)" weight:"300"}
        child: "Hello,"
      }
      {
        pos: [110 20]
        size: [(sub width 130) 40]
        font: {color:"rgb(250,250,250)" weight:"500"}
        child: "Moon"
      }
      {
        pos: [20 60]
        size: [(sub width 40) 25]
        font: {color:"rgb(80,80,80)" weight:"300"}
        child: (con "Block: " (my "blockNumber"))
      }
      {
        pos: [0 120]
        size: [width (sub height 120)]
        background: moonImage
        child: ""
      }
    ]
}
