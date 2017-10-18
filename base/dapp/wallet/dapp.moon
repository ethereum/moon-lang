min = zb2rhcMiWXCWrJDJtYVb6TWVf2YjSq4qy4vcki5uuAF5v4J9j
paddings = zb2rhioC1iQYahsx8iXWEcFY9GQgovSwM19YL8FZZqAsejNkQ
yourAccount = zb2rhj9JFLeoLh6aQTj8JBRbYZxZMP8g6XJ2BPGdLa8kBURF2
tokenTable = zb2rhX5D2owMESQbnsQTwM9ketGHYm3nY2W6b1MeY6uRcPaYh
sender = zb2rhadPgyULisq5aNhWjpEHMWYbMXyVAacyXX2CHizACoScW
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
concat = zb2rhen9kLmNpH8Tt7ASAjV3ws1EYDeqXYG1Us5AWyHc7qiX5
rgba = zb2rhncWqcLHBJZJJa7VhFmjk5AtE2dS2HaTyuYqzwgbJdBu2
{
  name: "ethereum-wallet"
  title: {text:"Ethereum Wallet" background:[226 218 218]}
  state: {token:""}
  set: {
    textColor: "#5F5454"
    backgroundColor: [226 218 218]
    actionColor: [74 144 226]
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
    bgColor = (my "backgroundColor")
    actionColor = (rgba (concat (my "actionColor") [1]))
    accountBox = {
      pos: [accountX accountY]
      size: [accountW accountH]
      background: (rgba (concat bgColor [1]))
      set: {textColor:textColor}
      value: (paddings
        gh
        gw
        gh
        gw
        my => {pos:[0 0] size:(my "size") value:yourAccount}
      )
    }
    tokensBox = {
      pos: [tokensX tokensY]
      size: [tokensW tokensH]
      onHear: token => (do "set" {token:token})> (do "stop")
      set: {selectable:(sub 1 (cmp token ""))}
      value: (paddings
        gh
        gw
        gh
        gw
        my =>
          {
            pos: [0 0]
            size: (my "size")
            color: "rgb(200,200,200)"
            set: {lineHeight:(mul gh 2)}
            value: tokenTable
          }
      )
    }
    senderBox = {
      pos: [senderX senderY]
      size: [senderW senderH]
      background: (rgba (concat bgColor [0.5]))
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
        (paddings
          gh
          gw
          gh
          gw
          my => {pos:[0 0] size:(my "size") value:sender}
        )
      )
    }
    {pos:[0 0] size:size value:[accountBox tokensBox senderBox]}
}
