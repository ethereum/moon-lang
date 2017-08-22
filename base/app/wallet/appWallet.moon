appWalletTop = zb2rhdhbyN3QLDnCS9R6RzuZPfvWNgR7pTxuzaFpahALLHGTa
appWalletWallets = zb2rhcdWnVuSXsHXbwqjjvWhP7WG1NxbEDSoD3pZDmAptSueg
appWalletSend = zb2rhi3zHC2wbXmc5PPBdjomuSWMgzrn8oog8QExjPXQx5Wq6

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
    topHeight = 86
    bottomHeight = (sub height topHeight)
    activeTab = (get state "activeTab")

    top = {
      pos:[0 0]
      size:[width topHeight]
      hear: tab => do => end => (do "setState" {activeTab: tab} (end 0))
      value: appWalletTop
    }

    bottom = {
      pos: [0 topHeight]
      size: [width bottomHeight]
      value:
        (if (cmp activeTab "WALLETS")
          appWalletWallets
          appWalletSend)
    }

    {
      pos: [0 0]
      size: size
      box: {text:{color:"rgb(200,200,200)"}}
      value: [top bottom]
    }
}
