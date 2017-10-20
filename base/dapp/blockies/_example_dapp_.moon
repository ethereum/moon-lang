renderAddress = zb2rhdLVJ4vfqAKdqPwydFxzYmzpiQeYERCuV9wbL51NkBMas
arrayImap = zb2rhbU6L7kgC7tmLRSmRKXqEbDeoqaRXRBn58nYrZ9JWJDyu
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX

addresses = [
  "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359"
  "0x554f8e6938004575bd89cbef417aea5c18140d92"
  "0xcc6294200fa6e6eb5c3034ed6b0b80401f5b0ceb"
  "0xbb9bc244d798123fde783fcc1c72d3bb8c189413"
  "0x6090a6e47849629b7245dfa1ca21d94cd15878ef"
  "0x314159265dd8dbb310642f98f50c066173c1259b"
  "0xd1ccfbf0a0dc2a9ed8a496b07e81dd8ecd7cb00e"
  "0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb"
]

(arrayImap 
  i => address => {
    pos: [(mul i 64) 0]
    size: [64 64]
    value: (renderAddress address 8 8)
  }
  addresses)
