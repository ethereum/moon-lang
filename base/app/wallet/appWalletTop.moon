appWalletTopButton = zb2rhhzc7jubFPdDqbj9Drs7HH1dZegrnVcvULGxiXo5gxPnG

{
  name: "ethereum-wallet-top"
  state: {
    activeTab: "WALLETS"
  }
  value: my =>
    size = (my "size")
    state = (my "state")
    w = (get size "0")
    h = (get size "1")
    activeTab = (get state "activeTab")

    topButton = x => w => label => icon =>
      {
        pos: [x 0]
        size: [w h]
        hear: words => do => end =>
          (do "setState" {activeTab: label} then =>
          (do "yell" label (end 0)))
        value: {
          name: label
          value: appWalletTopButton
          set: {
            label: label
            icon: icon
            active: (cmp activeTab label)
          }
        }
      }

    {
      pos: [0 0]
      size: [w h]
      box: {
        background: "linear-gradient(rgb(240,240,240), rgb(220,217,217))"
      }
      value: [
        (topButton 16 128 "WALLETS" "∑")
        (topButton 152 80 "SEND" "⇪")
      ]
    }
}
