title = zb2rhgVxRuCMyiunDuRaMtFCFEfqNU3CRqz1SzSa2EpCACRfD
label = zb2rhcoC7ABP6T3q2AhqmUY47SXCc7d8fGHYkGL9UWioaamBU
input = zb2rhXu3yqPyEx5nBKqATrLY8ZYLLqh5HjXQa71TzEzpWBPAa
formatAmount = zb2rhgj5ZNgE8uiu2NWB7dmb8HcdVHi5X5a7DgmJWJPuUEkFJ
addressInput = zb2rhZ1Fnx8Yauif6Apj7nwUJDvX1N3HW3EzcZs2vNYVyBMeu
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
select = zb2rhb7fWCHtBdFAKEFbpELP6UNXMxUCnnvcfjJmmCxc3UEVo
arrayMap = zb2rhgW1F8GpBDCtoXjEcqDBFXNiCDaPNt1fekX2Po8uHWiEV
arrayGet = zb2rhjfCUgfysNDVs2pTuMw9Um8hRbGyYdsjKCaMTceKAGDSG
arrayJoin = zb2rhgWm1GQM8ith9EBVJSMxsLAZBzGGsCvgnyaPZHmz3c7ym
erc20TokenList = zb2rhdWFStnichuAgzjzvnC3g1wMdp1hcDAdRginacN8zoqQs
tokenTransfer = zb2rhfr5TACypc3eLXqofWbGpAUWs4oUD2za4cFSs7ket6cYq

sendApp = my =>
  w = (get (my "size") "0")
  h = (get (my "size") "1")
  {
    name: "ethereum-wallet-send"
    state: {
      from: ""
      to: ""
      amount: ""
      result: ""
      tokenIndex: 0
      sendAll: 0
    }
    pos: [0 0]
    size: [w h]
    font:{family:"helvetica"}
    background:"rgb(250,250,250)"
    value: my =>
      state = (my "state")
      size = (my "size")
      w = (get size "0")
      h = (get size "1")
      token = (arrayGet erc20TokenList (get state "tokenIndex"))

      updateState = key => val =>
        refresh = k => (if (cmp key k) val (get state k))
        {
          from: (refresh "from")
          to: (refresh "to")
          amount: (refresh "amount")
          result: (refresh "result")
          tokenIndex: (refresh "tokenIndex")
          sendAll: (refresh "sendAll")
        }

      titleBar = {
        pos: [60 43]
        size: [232 32]
        value: title
        set: {sep: 0.32 fst: "Send" snd: "Transaction"}
      }

      labelText = {weight: "bold" color:"rgb(130,124,124)"}

      addressBox = y => updateAddress => addressName => addressLabel =>
        {
          pos: [60 y]
          size: [470 66]
          font: labelText
          onHear: from => 
            (do "setState" (updateAddress from))>
            (do "stop")
          name: addressName
          value: label
          set: {
            label: addressLabel
            thing: addressInput
          }
        }

      fromBox = (addressBox 95 (updateState "from") "from" "FROM")

      toBox = (addressBox 191 (updateState "to") "to" "SEND TO")

      amountBox = {
        name: "amount-box"
        pos: [60 324]
        size: [140 66]
        onHear: amount => 
          (do "setState" (updateState "amount" amount))>
          (do "stop")
        font: labelText
        value: label
        set: {
          label: "AMOUNT"
          type: "number"
          disabled: (get state "sendAll")
          thing: input
        }
      }

      tokenBox = {
        name: "token-box"
        pos: [210 370]
        size: [90 20]
        onHear: tokenIndex =>
          (do "setState" (updateState "tokenIndex" tokenIndex))>
          (do "stop")
        font: {
          align: "center"
          color: "rgb(130,124,124)"
        }
        value: select
        set: {
          arrows: {
            left: {
              font: {
                align: "center"
                color: "rgb(105,153,223)"
              }
              value: "←"
            }
            right: {
              font: {
                align: "center"
                color: "rgb(105,153,223)"
              }
              value: "→"
            }
          }
          options:
            option = token =>
              {
                font: {
                  align: "center"
                  color: "rgb(160,160,160)"
                }
                value: (get token "symbol")
              }
            (arrayMap option erc20TokenList)
        }
      }

      sendAllBox = {
        pos: [60 422]
        size: [105 20]
        value:
          [
            {
              pos: [0 0]
              size: [20 20]
              background: "rgb(241, 241, 241)"
              font: {
                align: "center"
                color: "rgb(140,140,140)"
              }
              cursor: "pointer"
              onClick: |
                newState = (updateState "sendAll" (sub 1 (get state "sendAll")))
                (do "setState" newState)>
                (do "stop")
              value: (if (get state "sendAll") "✔" "")
            }
            {
              pos: [35 0]
              size: [70 20]
              font: {
                color: "rgb(105, 153, 223)"
                size: 18
                weight: "bold"
              }
              value: "send all"
            }
          ]
      }

      sendButton = {
        pos: [0 475]
        size: [w (sub h 475)]
        background: "rgb(240,240,240)"
        value: [
          {
            pos: [60 40]
            size: [280 54]
            cursor: "pointer"
            background: "rgb(88,145,220)"
            radius: 2
            font:{size:22}
            borders:{bottom:{size:3 style:"solid" color:"rgb(60,151,212)"}}
            onClick: |
              to = (get state "to")
              amount = (stn (get state "amount"))
              symbol = (get token "symbol")
              (do "print" symbol)>
              (do "print" amount)>
              (do "setState" (updateState "result" ""))>
              result = <(tokenTransfer to amount symbol)
              (do "setState" (updateState "result" result))>
              (do "stop")
            value: {
              pos: [0 10]
              size: [280 36]
              font: {
                color: "rgb(250,250,250)"
                align: "center"
                size: 26
              }
              value: 
                amount = (if (get state "sendAll") "ALL" (formatAmount (stn (get state "amount"))))
                tokenSymbol = (get token "symbol")
                (arrayJoin " " ["SEND" amount tokenSymbol])
            }
          }
          {
            pos: [60 110]
            size: [(sub w 156) 16]
            value: (get state "result")
          }
        ]
      }

      [
        titleBar
        fromBox
        toBox
        amountBox
        tokenBox
        sendAllBox
        sendButton
      ]
  }

sendApp