tokenBalanceOf = zb2rho2Pzfh3RdxZDdwGPbXtD42ToYHmpjanzYSBsZPPBAHAQ
arrayMap = zb2rhgW1F8GpBDCtoXjEcqDBFXNiCDaPNt1fekX2Po8uHWiEV
sequence = zb2rhg7NaifN8YgJuszQYQL7zN2TnYuhFCxi8HgEgnNFgneHi
tokenList = zb2rharZc7GhmUrL3oaZbDaqrpSh1Z6Efc4NVzaCPdPNkZ7Po
tokenSymbols = (arrayMap token => (get token "symbol") tokenList)

address =>
  (sequence (arrayMap (tokenBalanceOf address) tokenSymbols))
