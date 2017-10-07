// Simple DApp that shows your ERC20 balances

arrayGet = zb2rhjfCUgfysNDVs2pTuMw9Um8hRbGyYdsjKCaMTceKAGDSG
arrayImap = zb2rhZtm57cN9goFEo37qLcAAsVza2QZU2WPMuABcDvZobk8o
arrayMap = zb2rhgW1F8GpBDCtoXjEcqDBFXNiCDaPNt1fekX2Po8uHWiEV
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
erc20BalancesOf = zb2rhaQVrHiDBQM1a3c23dNGomaq8PheRvg7S8q4ffNfyQz9T
numberFormatUnit = zb2rhnmbMkvo9bbynEktmPTrEU4ELWYz8PEgpGeELfT81V1fw
paddings = zb2rhioC1iQYahsx8iXWEcFY9GQgovSwM19YL8FZZqAsejNkQ
renderAddress = zb2rhe7DnDFA13zHnhUGUjBn7nMuDhyxbdgCds24WnR9Dc2G7
rows = zb2rhnMhVJf8kS9iAmpDbxGUASc38wox2bK9FSPRgU3JmjBzY
tokenList = zb2rhdWFStnichuAgzjzvnC3g1wMdp1hcDAdRginacN8zoqQs
tokenRow = zb2rhncYBN1MMTVqMGD3YbuQgX6fGsekaBR8fEE971WoHYUiR

{
  name: "erc20-token-table"

  state: {
    balances: (arrayMap (x => 0) tokenList)
  }

  args: {
    addr: "0xc7fE03CE5fB8D188554E19E64D34522e77C4e6D4"
    lineHeight: 24
  }

  value: my => 
    address = (my "addr")
    size = (my "size")
    state = (my "state")
    balances = (get state "balances")
    width = (get size "0")
    height = (get size "1")
    lineHeight = (my "lineHeight")

    addressIcon =
      {
        pos: [0 0]
        size: [lineHeight lineHeight]
        radius: (div lineHeight 2)
        value: (renderAddress address 8 (div lineHeight 8))
      }

    addressHex = 
      {
        pos: [lineHeight 0]
        size: [(sub width lineHeight) lineHeight]
        font: {color: "rgb(87,77,77)" family: "helvetica"}
        selectable: 1
        value: | (paddings 3 2 3 2)> address
      }

    tokenTable = 
      {
        pos: [0 (add lineHeight 2)]
        size: [width (sub height 28)]
        value: (rows {
          sizes: 
            nw = (div (sub width (add lineHeight 32)) 2)
            {
              rows: [lineHeight nw nw 36]
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
        (do "setState" {balances: balances})>
        (do "stop")

      // Renders ERC20 table
      value: [addressIcon addressHex tokenTable]
  }
}
