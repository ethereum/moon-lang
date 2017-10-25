min = zb2rhcMiWXCWrJDJtYVb6TWVf2YjSq4qy4vcki5uuAF5v4J9j
paddings = zb2rhih6haVR3ksSJ8uAh5xZkK3tvDgb1ZWEPQBnjFpoPF4SQ
yourAccount = zb2rhbBTuYFEfnC5bPh76vx7XJVMCHtrwGBWwdKA3Me2JAt6f
tokenTable = zb2rhhYzcm5MAbkehawiZpWWFypx2Q1LE13qfvNQ3KSsGKCog
sender = zb2rhXSeL32d4vWAJx33AJ8EKhkPU2qZDveY6yYKnKbJCRC3k
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX

{
  name: "ethereum-wallet"
  title: {text:"Ethereum Wallet" background:"rgb(226,218,218)"}
  state: {token:""}
  args: {
    textColor: "rgb(95,84,84)"
    backgroundColor: "rgb(226,218,218)"
    actionColor: "rgb(74,144,226)"
  }
  child: my =>
    size = (my "size")
    token = (my "token")
    w = (get size "0")
    h = (get size "1")
    gw = 32
    gh = 16
    sided = (or (gtn w (mul 30 gw)) (and (gtn w h) (ltn h (mul 38 gh))))
    accountW = w
    accountH = (mul 4 gh)
    tokensW = (if sided (div w 2) w)
    tokensH = (if sided (sub h accountH) (mul gh 14))
    senderW = (if sided (div w 2) w)
    senderH = (if sided (sub h accountH) (sub h (add tokensH accountH)))
    accountX = 0
    accountY = 0
    senderX = (if sided tokensW 0)
    senderY = (add accountH (if sided 0 tokensH))
    tokensX = 0
    tokensY = accountH
    textColor = (my "textColor")
    backgroundColor = (my "backgroundColor")
    actionColor = (my "actionColor")
    accountBox = {
      pos: [accountX accountY]
      size: [accountW accountH]
      background: backgroundColor
      set: {textColor:textColor}
      child:
        child = my => {pos:[0 0] size:(my "size") child:yourAccount}
        (paddings gh gw gh gw child)
    }
    tokensBox = {
      pos: [tokensX tokensY]
      size: [tokensW tokensH]
      onHear: token => (do "set" {token:token})> (do "stop")
      set: {selectable:(sub 1 (cmp token ""))}
      background: "rgba(255,255,255,0.5)"
      child: 
        child = my =>
          {
            pos: [0 0]
            size: (my "size")
            color: "rgb(200,200,200)"
            set: {
              lineHeight: (mul gh 2)
              textColor: textColor
              backgroundColor: backgroundColor
              actionColor: actionColor
            }
            child: tokenTable
          }
        (paddings gh gw gh gw child)
    }
    senderBox = {
      pos: [senderX senderY]
      size: [senderW senderH]
      set: {token:(my "token")}
      onHear: result =>
        type = (get result "type")
        (if (cmp type "cancel")
          | (do "set" {token:""})> (do "stop")
          (do "stop")
        )
      set: {linkColor:actionColor}
      child: (if (cmp token "")
        {
          pos: [gw gh]
          size: [senderW (mul gh 1.2)]
          font: {family:"helvetica" color:actionColor weight:600}
          cursor: "pointer"
          onClick: | (do "set" {token:"eth"})> (do "stop")
          child: "Send Transaction..."
        }
        child = my => {pos:[0 0] size:(my "size") child:sender}
        (paddings gh gw gh gw child)
      )
    }
    {pos:[0 0] size:size child:[accountBox tokensBox senderBox]}
}
