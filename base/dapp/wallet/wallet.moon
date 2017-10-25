min = zb2rhcMiWXCWrJDJtYVb6TWVf2YjSq4qy4vcki5uuAF5v4J9j
paddings = zb2rhioC1iQYahsx8iXWEcFY9GQgovSwM19YL8FZZqAsejNkQ
yourAccount = zb2rhiC9Z8W6qBmp27PAZk65Q9fenDkDbkacQfhiFEJ7Jartk
tokenTable = zb2rhc6rDc8mSqjNkNGKvFn7SCBrD861GBhpmQFhziYg1bR3Y
sender = zb2rhkxPAW2Bu3GzWGxvn5cxhLRD8XKbzkS5JYoJHsCZgTt2P
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
withAlpha = zb2rhmDXZmJm8CGxQUQdVLWoiAKuinhSBH9TgWfUDq9foqVBZ

{
  name: "ethereum-wallet"
  title: {text:"Ethereum Wallet" background:[226 218 218]}
  state: {token:""}
  args: {
    textColor: "rgb(95,84,84)"
    backgroundColor: "rgb(226,218,218)"
    actionColor: "rgb(74,144,226)"
  }
  value: my =>
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
      value:
        value = my => {pos:[0 0] size:(my "size") value:yourAccount}
        (paddings gh gw gh gw value)
    }
    tokensBox = {
      pos: [tokensX tokensY]
      size: [tokensW tokensH]
      onHear: token => (do "set" {token:token})> (do "stop")
      set: {selectable:(sub 1 (cmp token ""))}
      value: 
        value = my =>
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
            value: tokenTable
          }
        (paddings gh gw gh gw value)
    }
    senderBox = {
      pos: [senderX senderY]
      size: [senderW senderH]
      background: (withAlpha backgroundColor 0.5)
      set: {token:(my "token")}
      onHear: result =>
        type = (get result "type")
        (if (cmp type "cancel")
          | (do "set" {token:""})> (do "stop")
          (do "stop")
        )
      set: {linkColor:actionColor}
      value: (if (cmp token "")
        {
          pos: [gw gh]
          size: [senderW (mul gh 1.2)]
          font: {family:"helvetica" color:actionColor weight:600}
          cursor: "pointer"
          onClick: | (do "set" {token:"eth"})> (do "stop")
          value: "Send Transaction..."
        }
        value = my => {pos:[0 0] size:(my "size") value:sender}
        (paddings gh gw gh gw value)
      )
    }
    {pos:[0 0] size:size value:[accountBox tokensBox senderBox]}
}
