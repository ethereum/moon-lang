// Simple DApp that shows your 0x balance

do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
sequence = zb2rhg7NaifN8YgJuszQYQL7zN2TnYuhFCxi8HgEgnNFgneHi
arrayGet = zb2rhjfCUgfysNDVs2pTuMw9Um8hRbGyYdsjKCaMTceKAGDSG
arrayMap = zb2rhgW1F8GpBDCtoXjEcqDBFXNiCDaPNt1fekX2Po8uHWiEV
table = zb2rhbTdqknDUXhz9B58RTdRL2sH1PR79SNL4LkC3SE5Q1c1E
renderAddress = zb2rhe7DnDFA13zHnhUGUjBn7nMuDhyxbdgCds24WnR9Dc2G7
tokenList = zb2rhdWFStnichuAgzjzvnC3g1wMdp1hcDAdRginacN8zoqQs
tokenBalanceOf = zb2rhoMCwpqp2SELVrPKk1ASo9XhY6hg1rb8Y4AiVeyNp2mta
numberFormatUnit = zb2rhnmbMkvo9bbynEktmPTrEU4ELWYz8PEgpGeELfT81V1fw
tokenSymbols = (arrayMap token => (get token "symbol") tokenList)

{
  name: "erc20-token-table"

  state: {
    balances: (arrayMap (x => 0) tokenList)
  }

  args: {
    addr: "0xb794f5ea0ba39494ce839613fffba74279579268"
  }

  value: my => 
    address = (my "addr")
    size = (my "size")
    state = (my "state")
    balances = (get state "balances")
    {
      // Styles
      pos: [0 0]
      size: [380 (get size "1")]
      font: {
        color: "rgb(87,77,77)"
        family: "helvetica"
      }

      // Gets data from blockchain
      onFetch: |
        balances = <(sequence (arrayMap (tokenBalanceOf address) tokenSymbols))
        (do "setState" {balances: balances})>
        (do "stop")

      // Renders ERC20 table
      value:

        addressInfo = {
          pos: [0 0]
          size: [380 28]
          value: [
            {
              pos: [3 2]
              size: [24 24]
              radius: 12
              value: (renderAddress address 8 3)
            }
            {
              pos: [31 6]
              size: [(sub 380 31) 16]
              selectable: 1
              value: address
            }
          ]
        }


        tokenTable = (table {
          sizes: {
            rows: [24 144 176 36]
            cols: (arrayMap (x => 24) tokenList)
          }
          wrap: size => value => {
            pos: [0 28]
            size: size
            value: value
          }
          cell: idx => pos => size =>
            i = (get idx "0")
            j = (get idx "1")
            w = (get size "0")
            h = (get size "1")
            token = (arrayGet tokenList j) 
            name = (get token "name")
            address = (get token "address")
            symbol = (get token "symbol")
            balance = (arrayGet balances j)
            balanceString = (numberFormatUnit balance)
            blockiesCell = x => {
              pos: [7 4]
              size: [16 16]
              radius: 8
              value: (renderAddress address 8 2)
            }
            nameCell = x => {
              pos: [10 3]
              size: [(sub w 10) (sub h 6)]
              value: name
            }
            balanceCell = x => {
              pos: [10 3]
              size: [(sub w 10) (sub h 6)]
              font: {family: "monospace"}
              value: balanceString
            }
            symbolCell = x => {
              pos: [2 5]
              size: [(sub w 2) (sub h 7)]
              font: {
                family: "monospace"
                size: 12
                weight: "bold"
              }
              value: symbol
            }
            cells = [blockiesCell nameCell balanceCell symbolCell]
            {
              pos: pos
              size: size
              background: (if (mod j 2) "rgba(0,0,0,0)" "rgba(0,0,0,0.05)")
              value: (arrayGet cells i 0)
            }
        })

        [
          addressInfo
          tokenTable
        ]
  }
}
