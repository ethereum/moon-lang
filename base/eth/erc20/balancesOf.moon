tokenBalanceOf = zb2rheUGzeTFy5pXkBmS26hiaiVa6J5mcf7m2mdZE6nFfvjwH
arrayMap = zb2rhgW1F8GpBDCtoXjEcqDBFXNiCDaPNt1fekX2Po8uHWiEV
sequence = zb2rhg7NaifN8YgJuszQYQL7zN2TnYuhFCxi8HgEgnNFgneHi
tokenList = zb2rhiiq8LhauWFmAQtMNmyaDbWKYtBaxc7wGg1hAESY5Vnp6
tokenSymbols = (arrayMap token => (get token "symbol") tokenList)

address =>
  (sequence (arrayMap (tokenBalanceOf address) tokenSymbols))
