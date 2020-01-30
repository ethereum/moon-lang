renderAddress = zb2rhdkgwMJAUkUAqX9mcjNCsHx2sSHFrTyz2xiJtReKCQW9J

addresses = [
  "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359"
  "0x554f8e6938004575bd89cbef417aea5c18140d92"
  "0xcc6294200fa6e6eb5c3034ed6b0b80401f5b0ceb"
  "0xbb9bc244d798123fde783fcc1c72d3bb8c189413"
  "0x6090a6e47849629b7245dfa1ca21d94cd15878ef"
  "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
  "0xd1ccfbf0a0dc2a9ed8a496b07e81dd8ecd7cb00e"
  "0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb"
]

{
  name: "blockies-example"
  state: {x:0}
  child: my =>
    {
      child: [
        {
          pos: [0 0]
          size: [64 64]
          child: (renderAddress (get addresses "0") 8 8)
        }
        {
          pos: [64 0]
          size: [64 64]
          child: (renderAddress (get addresses "1") 8 8)
        }
        {
          pos: [128 0]
          size: [64 64]
          child: (renderAddress (get addresses "2") 8 8)
        }
      ]
    }
}
