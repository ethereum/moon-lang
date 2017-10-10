appWalletTop = zb2rhjNgBa9a74gNfGFWxyswhB1nRbQGG3Z6FaHwyXoDA7LuW
appWalletSend = zb2rhcLDiG9nihhRkRJ3rnGYtTpuvmTfmRF2totA82itkbuAW
appWalletReceive = zb2rhms2DkGUSgHsdNHnNGuV4ifkTSBYfaQ1SyB1Zx2VTU5UX

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
        (do "setState" {activeTab: tab})>
        (do "stop")
      value: appWalletTop
    }

    bottom = {
      pos: [0 topHeight]
      size: [width bottomHeight]
      background: "rgb(250,250,250)"
      value:
        (if (cmp activeTab "RECEIVE")
          appWalletReceive
          appWalletSend)
    }

    {
      pos: [0 0]
      size: size
      value: [top bottom]
    }
}
