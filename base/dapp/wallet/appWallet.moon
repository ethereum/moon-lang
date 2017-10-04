appWalletTop = zb2rhcKX6uNg3pKCxiwuwcH3JVaNMKwCCqthgg2VQH6FoGwYE
appWalletSend = zb2rhbm4yDdYoV8mbmXZ7o2Bn7XRTvosMSxt4EytfHg4cedJ7

{
  name: "ethereum-wallet",
  state: {
    activeTab: "WALLETS"
  }
  value: my =>
    size = (my "size")
    state = (my "state")
    width = (get size "0")
    height = (get size "1")
    topHeight = 109
    bottomHeight = (sub height topHeight)
    activeTab = (get state "activeTab")

    top = {
      pos:[0 0]
      size:[width topHeight]
      onHear: tab => do =>
        (do "setState" {activeTab: tab}
          (do "stop"))
      value: appWalletTop
    }

    bottom = {
      pos: [0 topHeight]
      size: [width bottomHeight]
      background: "rgb(250,250,250)"
      value:
        (if (cmp activeTab "WALLETS")
          "-"
          appWalletSend)
    }

    {
      pos: [0 0]
      size: size
      value: [top bottom]
    }
}
