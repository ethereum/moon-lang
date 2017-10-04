appWalletTopButton = zb2rhcmkPB4N5wKwbjUwGCzEvXrJifEjaz4JhWXVjPDWg6HAJ

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
        onHear: words => do =>
          (do "setState" {activeTab: label} then =>
          (do "yell" label (do "stop")))
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
      background: "linear-gradient(rgb(240,240,240), rgb(220,217,217))"
      value: [
        (topButton 16 128 "WALLETS" "∑")
        (topButton 152 80 "SEND" "⇪")
      ]
    }
}
