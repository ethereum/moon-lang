renderAddress = zb2rhe7DnDFA13zHnhUGUjBn7nMuDhyxbdgCds24WnR9Dc2G7
paddings = zb2rhioC1iQYahsx8iXWEcFY9GQgovSwM19YL8FZZqAsejNkQ
numberFormatUnit = zb2rhnmbMkvo9bbynEktmPTrEU4ELWYz8PEgpGeELfT81V1fw

size => dark => symbol => name => address => balance =>
  height = (get size "1")
  radius = (div height 2)
  nameFont = {
    color: "rgb(87,77,77)"
    family: "helvetica"
  }
  balanceFont = {
    family: "monospace"
    align: "right"
  } 
  symbolFont = {
    family: "monospace"
    size: 12
    weight: "bold"
  }
  shade = value => (if dark {background:"rgba(0,0,0,0.05)" value:value} value)
  icon = (renderAddress address 8 (div height 8))
  [
    (shade (paddings 3 2 3 2 {radius:radius value:icon}))
    (shade (paddings 3 2 3 2 {font:nameFont value:name}))
    (shade (paddings 3 1 3 0 {font:balanceFont value:(numberFormatUnit balance)}))
    (shade (paddings 3 0 3 1 {font:symbolFont value:symbol}))
  ]
