tokenBalanceOf = zb2rhoMCwpqp2SELVrPKk1ASo9XhY6hg1rb8Y4AiVeyNp2mta
arrayMap = zb2rhgW1F8GpBDCtoXjEcqDBFXNiCDaPNt1fekX2Po8uHWiEV
sequence = zb2rhg7NaifN8YgJuszQYQL7zN2TnYuhFCxi8HgEgnNFgneHi
tokenList = zb2rhdWFStnichuAgzjzvnC3g1wMdp1hcDAdRginacN8zoqQs
tokenSymbols = (arrayMap token => (get token "symbol") tokenList)

address =>
  (sequence (arrayMap (tokenBalanceOf address) tokenSymbols))
