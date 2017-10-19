tokenBalanceOf = zb2rhkqJpcFN4egKyDtV6QmSJenbma72cxNuVUAg1PbQKvYUZ
arrayMap = zb2rhgW1F8GpBDCtoXjEcqDBFXNiCDaPNt1fekX2Po8uHWiEV
sequence = zb2rhg7NaifN8YgJuszQYQL7zN2TnYuhFCxi8HgEgnNFgneHi
tokenList = zb2rhnh6h5iDikW8SNUFXRsrcLHDW8FYW4xRTXGzja1xicHxf
tokenSymbols = (arrayMap token => (get token "symbol") tokenList)

address =>
  (sequence (arrayMap (tokenBalanceOf address) tokenSymbols))
