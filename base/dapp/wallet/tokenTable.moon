arrayGet = zb2rhjfCUgfysNDVs2pTuMw9Um8hRbGyYdsjKCaMTceKAGDSG
arrayImap = zb2rhZtm57cN9goFEo37qLcAAsVza2QZU2WPMuABcDvZobk8o
arrayMap = zb2rhgW1F8GpBDCtoXjEcqDBFXNiCDaPNt1fekX2Po8uHWiEV
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
erc20BalancesOf = zb2rhaQVrHiDBQM1a3c23dNGomaq8PheRvg7S8q4ffNfyQz9T
paddings = zb2rhioC1iQYahsx8iXWEcFY9GQgovSwM19YL8FZZqAsejNkQ
renderAddress = zb2rhdLVJ4vfqAKdqPwydFxzYmzpiQeYERCuV9wbL51NkBMas
rows = zb2rhnMhVJf8kS9iAmpDbxGUASc38wox2bK9FSPRgU3JmjBzY
tokenList = zb2rhkRx8QAC8AspBZK349BZML2tNe8t1rDC65rYMgRNZB9rU
tokenRow = zb2rhncYBN1MMTVqMGD3YbuQgX6fGsekaBR8fEE971WoHYUiR
rgba = zb2rhncWqcLHBJZJJa7VhFmjk5AtE2dS2HaTyuYqzwgbJdBu2
concat = zb2rhen9kLmNpH8Tt7ASAjV3ws1EYDeqXYG1Us5AWyHc7qiX5
{
  name: "erc20-token-table"
  value: my =>
    {
      state: {balances:(arrayMap x => 0 tokenList) selected:""}
      args: {
        addr: (my "address")
        lineHeight: 32
        backgroundColor: [226 216 216]
        actionColor: [74 144 266]
        textColor: "#333"
        selectable: 0
      }
      value: my =>
        address = (my "addr")
        size = (my "size")
        balances = (my "balances")
        width = (get size "0")
        height = (get size "1")
        lineHeight = (my "lineHeight")
        bgColors = (my "backgroundColor")
        actionColor = (my "actionColor")
        isSelectable = (my "selectable")
        textColor = (if isSelectable
          (rgba (concat actionColor [1]))
          (my "textColor")
        )
        tokenRow = size => dark => symbol => name => address => balance =>
          height = (get size "1")
          radius = (div height 2)
          onClick = (if isSelectable
            newState = {balances:(my "balances") selected:symbol}
            (do "set" newState)>
            (do "yell" symbol)>
            (do "stop")
            0
          )
          selected = (cmp symbol (my "selected"))
          linkColor = (if (and isSelectable selected) "#FFFFFF" textColor)
          nameFont = {color:linkColor family:"helvetica"}
          balanceFont = {family:"helvetica" align:"right" color:linkColor}
          symbolFont = {
            family: "helvetica"
            size: (mul lineHeight 0.35)
            weight: "bold"
            color: linkColor
          }
          background = (if isSelectable
            (if selected
              (rgba (concat actionColor [1]))
              (if dark
                (rgba (concat actionColor [0.1]))
                (rgba (concat actionColor [0.05]))
              )
            )
            (if dark
              (rgba (concat bgColors [0.5]))
              (rgba (concat bgColors [0.1]))
            )
          )
          wrap = t => r => l => b => value =>
            {
              background: background
              cursor: (if isSelectable "pointer" "normal")
              onClick: onClick
              value: (paddings t r l b value)
            }
          r = (mul lineHeight 0.32)
          p = (mul lineHeight 0.25)
          q = (mul lineHeight 0.15)
          icon = (if (cmp address "0x0000000000000000000000000000000000000000")
            {font:{family:"icomoon" color:linkColor} value:""}
            (renderAddress address 8 (div (sub height (mul q 2)) 8))
          )
          [
            (wrap q q q q {radius:radius value:icon})
            (wrap p p p p {font:nameFont value:name})
            (wrap p p p p {font:balanceFont value:(nts balance)})
            (wrap r 0 r 0 {font:symbolFont value:symbol})
            (wrap
              p
              p
              p
              p
              {
                font: nameFont
                color: textColor
                value: (if (and isSelectable selected) "✔︎" " ")
              }
            )
          ]
        tokenTable = {
          pos: [0 0]
          size: [width height]
          scroll: 1
          value: (rows
            {
              sizes:
                nw = (div (sub width (mul lineHeight 3)) 2)
                {
                  rows: [lineHeight nw nw lineHeight lineHeight]
                  cols: (arrayMap x => lineHeight tokenList)
                }
              lines:
                tokenLine = i => token =>
                  symbol = (get token "symbol")
                  name = (get token "name")
                  address = (get token "address")
                  balance = (arrayGet balances i)
                  (tokenRow
                    [width lineHeight]
                    (mod (add i 1) 2)
                    symbol
                    name
                    address
                    balance
                  )
                (arrayImap tokenLine tokenList)
            }
          )
        }
        {
          onFetch: |
            balances = <(erc20BalancesOf address)
            selected = <(do "get" "selected")
            newState = {balances:balances selected:selected}
            (do "set" newState)>
            (do "stop")
          value: tokenTable
        }
    }
}
