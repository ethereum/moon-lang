arrayGet = zb2rhjfCUgfysNDVs2pTuMw9Um8hRbGyYdsjKCaMTceKAGDSG
arrayImap = zb2rhZtm57cN9goFEo37qLcAAsVza2QZU2WPMuABcDvZobk8o
arrayMap = zb2rhgW1F8GpBDCtoXjEcqDBFXNiCDaPNt1fekX2Po8uHWiEV
arrayZipWith = zb2rhiHxfGRPmrJqfaCaef7BWASWgwNTCvBSPAWTcfSEbqbFx
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
erc20BalancesOf = zb2rhmybMXoUsMLY79H1nG2PYFeH5C9ufuScswbfTZKNypThN
tokenList = zb2rhnh6h5iDikW8SNUFXRsrcLHDW8FYW4xRTXGzja1xicHxf
paddings = zb2rhioC1iQYahsx8iXWEcFY9GQgovSwM19YL8FZZqAsejNkQ
renderAddress = zb2rhX8bHJsvCUHjVEkeLynfNunnhHEXaDRokPa55BgE5r88u
rows = zb2rhnMhVJf8kS9iAmpDbxGUASc38wox2bK9FSPRgU3JmjBzY
arraySlice = zb2rhiPF8JLJ2JFUKR3MGk8HvdjSSa6oAY7KmVpXzZfcD65zu
tokenRow = zb2rhncYBN1MMTVqMGD3YbuQgX6fGsekaBR8fEE971WoHYUiR
withAlpha = zb2rhmDXZmJm8CGxQUQdVLWoiAKuinhSBH9TgWfUDq9foqVBZ

{
  name: "erc20-token-table"
  value: my =>
    {
      state: {
        balances:(arrayMap x => 0 tokenList)
        selected:""
      }
      args: {
        addr: (my "address")
        lineHeight: 32
        backgroundColor: "rgb(226,218,218)"
        actionColor: "rgb(74,144,266)"
        textColor: "rgb(51,51,51)"
        selectable: 0
      }
      value: my =>
        address = (my "addr")
        size = (my "size")
        width = (get size "0")
        height = (get size "1")
        lineHeight = (my "lineHeight")
        backgroundColor = (my "backgroundColor")
        actionColor = (my "actionColor")
        selected = (my "selected")
        isSelectable = (my "selectable")
        usedTokenList = 
          addBalance = balance => token => {
            symbol: (get token "symbol")
            name: (get token "name")
            address: (get token "address")
            balance: balance
          }
          tokens = (arrayZipWith addBalance (my "balances") tokenList)
          show = token => 
            hasBalance = (gtn (get token "balance") 0)
            isETH = (cmp (get token "symbol") "ETH")
            (or hasBalance isETH)
          tokens
        textColor = (if isSelectable
          actionColor
          (my "textColor")
        )
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
                  cols: (arrayMap x => lineHeight usedTokenList)
                }
              lines:
                buildTokenRow = i => token =>
                  symbol = (get token "symbol")
                  name = (get token "name")
                  address = (get token "address")
                  balance = (get token "balance")
                  isSelected = (cmp symbol selected)
                  isDark = (mod (add i 1) 2)
                  height = (get size "1")
                  radius = (div height 2)
                  onClick =
                    select = |
                      (do "set" {selected: symbol})>
                      (do "yell" symbol)>
                      (do "stop")
                    skip = |
                      (do "stop")
                    (if isSelectable select skip)
                  linkColor = (if (and isSelectable isSelected) "#FFFFFF" textColor)
                  nameFont = {color:linkColor family:"helvetica"}
                  balanceFont = {family:"helvetica" align:"right" color:linkColor}
                  symbolFont = {
                    family: "helvetica"
                    size: (mul lineHeight 0.35)
                    weight: "bold"
                    color: linkColor
                  }
                  background = (if isSelectable
                    (if isSelected
                      actionColor
                      (if isDark
                        (withAlpha actionColor 0.1)
                        (withAlpha actionColor 0.05)
                      )
                    )
                    (if isDark
                      (withAlpha backgroundColor 0.5)
                      (withAlpha backgroundColor 0.1)
                    )
                  )
                  cell = t => r => l => b => value =>
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
                    (renderAddress address 8 (div (sub lineHeight (mul q 2)) 8))
                  )
                  tick = (if (and isSelectable isSelected) "✔︎" " ")
                  [
                    (cell q q q q {radius:radius value:icon})
                    (cell p p p p {font:nameFont value:name})
                    (cell p p p p {font:balanceFont value:(nts balance)})
                    (cell r 0 r 0 {font:symbolFont value:symbol})
                    (cell p p p p {font:nameFont color:textColor value:tick})
                  ]
                (arrayImap buildTokenRow usedTokenList)
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
