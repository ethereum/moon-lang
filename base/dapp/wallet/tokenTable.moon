arrayGet = zb2rhjfCUgfysNDVs2pTuMw9Um8hRbGyYdsjKCaMTceKAGDSG
arrayImap = zb2rhZtm57cN9goFEo37qLcAAsVza2QZU2WPMuABcDvZobk8o
arrayMap = zb2rhgW1F8GpBDCtoXjEcqDBFXNiCDaPNt1fekX2Po8uHWiEV
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
erc20BalancesOf = zb2rhaQVrHiDBQM1a3c23dNGomaq8PheRvg7S8q4ffNfyQz9T
paddings = zb2rhioC1iQYahsx8iXWEcFY9GQgovSwM19YL8FZZqAsejNkQ
renderAddress = zb2rhe7DnDFA13zHnhUGUjBn7nMuDhyxbdgCds24WnR9Dc2G7
rows = zb2rhnMhVJf8kS9iAmpDbxGUASc38wox2bK9FSPRgU3JmjBzY
tokenList = zb2rhdWFStnichuAgzjzvnC3g1wMdp1hcDAdRginacN8zoqQs
tokenRow = zb2rhncYBN1MMTVqMGD3YbuQgX6fGsekaBR8fEE971WoHYUiR

{
  name: "erc20-token-table"
  value: my =>
  {
    state: {
      balances: (arrayMap (x => 0) tokenList)
      selected: ""
    }

    args: {
      addr: (my "address")
      lineHeight: 32
    }

    value: my => 
      address = (my "addr")
      size = (my "size")
      balances = (my "balances")
      width = (get size "0")
      height = (get size "1")
      lineHeight = (my "lineHeight")

      tokenRow = size => dark => symbol => name => address => balance =>
        height = (get size "1")
        radius = (div height 2)
        onClick =
          newState = {
            balances: (my "balances")
            selected: symbol
          }
          (do "set" newState)>
          (do "yell" symbol)>
          (do "stop")
        nameFont = {
          color: "rgb(87,77,77)"
          cursor: "poiter"
          family: "helvetica"
        }
        balanceFont = {
          family: "helvetica"
          align: "right"
        } 
        symbolFont = {
          family: "helvetica"
          size: (mul lineHeight 0.35)
          weight: "bold"
        }
        selected = (cmp symbol (my "selected"))
        background =
          (if selected
            "rgba(0,0,0,0.15)"
            (if dark
              "rgba(0,0,0,0.05)"
              "rgba(0,0,0,0)"
            )
          )
        wrap = t => r => l => b => value =>
          {
            background: background
            cursor: "pointer"
            onClick: onClick
            value: (paddings t r l b value)
          }
        r = (mul lineHeight 0.32)
        p = (mul lineHeight 0.25)
        q = (mul lineHeight 0.15)
        icon = (if (cmp address "0x0000000000000000000000000000000000000000")
          {font: {family: "icomoon"}, value: ""}
          (renderAddress address 8 (div (sub height (mul q 2)) 8)))
        [
          (wrap q q q q {
            radius: radius
            value: icon
          })
          (wrap p p p p {
            font: nameFont
            value: name
          })
          (wrap p p p p {
            font: balanceFont
            value: (nts balance)
          })
          (wrap r 0 r 0 {
            font: symbolFont
            value: symbol
          })
          (wrap p p p p {
            font: nameFont
            value: (if selected "✔︎" " ")
          })
        ]

      tokenTable = 
        {
          pos: [0 0]
          size: [width height]
          scroll: 1
          value: (rows {
            sizes: 
              nw = (div (sub width (mul lineHeight 3)) 2)
              {
                rows: [lineHeight nw nw lineHeight lineHeight]
                cols: (arrayMap (x => lineHeight) tokenList)
              }
            lines: 
              tokenLine = i => token =>
                symbol = (get token "symbol")
                name = (get token "name")
                address = (get token "address")
                balance = (arrayGet balances i)
                (tokenRow [width lineHeight] (mod (add i 1) 2) symbol name address balance)

              (arrayImap tokenLine tokenList)
          })
        }

      {
        // Gets data from blockchain
        onFetch: |
          balances = <(erc20BalancesOf address)
          selected = <(do "get" "selected")
          newState = {
            balances: balances
            selected: selected
          }
          (do "set" newState)>
          (do "stop")

        // Renders ERC20 table
        value: tokenTable
    }
  }
}
