min = zb2rhcMiWXCWrJDJtYVb6TWVf2YjSq4qy4vcki5uuAF5v4J9j
paddings = zb2rhioC1iQYahsx8iXWEcFY9GQgovSwM19YL8FZZqAsejNkQ
yourAccount = zb2rhmnw3yMWKZMYkyn1dxzYXzGsamc1USr28NHabbEE5f1qP
tokens = zb2rhgh6NjS6XjhWHGjAPr4qsv6y2p6aLVP51aiBKWJNADFk2
sender = zb2rhgY9D3fLd3zuLFDXgQGpmNEqyKuUyeh6tudnR21onowNo
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX

{
  name: "ethereum-wallet",
  state: {
    token: ""
  }
  value: my =>
    size = (my "size")
    state = (my "state")
    token = (get state "token")
    w = (get size "0")
    h = (get size "1")
    gw = 32
    gh = 16
    sided = (gtn w (mul 30 gw)) 

    accountW = w
    accountH = (mul 4 gh)
    tokensW = (if sided (div w 2) w)
    tokensH = (if sided (sub h accountH) (sub h (add (mul 20 gh) accountH)))
    senderW = (if sided (div w 2) w)
    senderH = (if sided (sub h accountH) (mul 20 gh))
    accountX = 0
    accountY = 0
    senderX = (if sided tokensW 0)
    senderY = (add accountH (if sided 0 tokensH))
    tokensX = 0
    tokensY = accountH

    accountBox = {
      pos: [accountX accountY]
      size: [accountW accountH]
      value: (paddings gh gw gh gw my => {
        pos: [0 0]
        size: (my "size")
        value: yourAccount
      })
    }

    tokensBox = {
      pos: [tokensX tokensY]
      size: [tokensW tokensH]
      background: "rgb(249,249,249)"
      onHear: token => 
        (do "setState" {token: token})>
        (do "stop")
      value: (paddings gh gw gh gw my => {
        pos: [0 0]
        size: (my "size")
        color: "rgb(200,200,200)"
        value: tokens
      })
    }

    senderBox = {
      pos: [senderX senderY]
      size: [senderW senderH]
      set: {token: (get state "token")}
      onHear: result =>
        type = (get result "type")
        (if (cmp type "cancel")
          | (do "setState" {token: ""})>
            (do "stop")
          | (do "stop"))
      value: 
        (if (cmp token "")
          {
            pos: [gw gh]
            size: [senderW (mul gh 1.2)]
            font: {
              family: "helvetica"
              color: "rgb(77,139,219)"
            }
            cursor: "pointer"
            onClick: |
              (do "setState" {token: "eth"})>
              (do "stop")
            value: "Send Transaction..."
          }
          (paddings gh gw gh gw my => {
            pos: [0 0]
            size: (my "size")
            value: sender
          })
        )
    }



    {
      pos: [0 0]
      size: size
      value: [
        accountBox
        tokensBox
        senderBox
      ]
    }
}
