tokenBalanceOf = zb2rhbscFaa6qPfrjPTcKF8urydUEcCg45zUuh3zpdAXZCuUm
arrayMap = zb2rhgW1F8GpBDCtoXjEcqDBFXNiCDaPNt1fekX2Po8uHWiEV
sequence = zb2rhg7NaifN8YgJuszQYQL7zN2TnYuhFCxi8HgEgnNFgneHi
tokenList = zb2rhgcLCPMhpPPXdLqzvbzqcXeoGt4MneJgLBUQU1wDvaPR2
tokenSymbols = (arrayMap token => (get token "symbol") tokenList)

address =>
  (sequence (arrayMap (tokenBalanceOf address) tokenSymbols))
