account = zb2rhaeH8zzDZ4yWGyEGJdfgTtRAfGdVEQor33u8NftHDsYcV
title = zb2rhomap7bxY5r3d31orywF5KwCjrh9Y8HVypyJHmRAZ6Ep8
imap = zb2rhbU6L7kgC7tmLRSmRKXqEbDeoqaRXRBn58nYrZ9JWJDyu

my =>
  {
    pos: [60 0]
    size: [(sub (get (my "size") "0") 120) (get (my "size") "1")]
    value: my =>
      size = (my "size")
      accounts = (my "accounts")

      accountsTape = {
        pos: [0 132]
        size: [88 20]
        box: {
          background: "rgb(129,122,122)"
          paddings: {top: 0} 
          text: {
            color: "rgb(252,252,252)"
            align:"center"
            weight:"bold"
            size:14
          }
        }
        value: "ACCOUNTS"
      }

      accountBox = i => acc =>
        address = (get acc "address")
        balance = (get acc "balance")
        {
          pos: [0 (add 180 (mul i 110))]
          size: [380 75]
          box: {
            onClick: do => end => (do "eth" ["selectAccount" [address]] then => (end 0))
          }
          value: account
          set: {
            name: (con "Acccount " (nts i))
            address: address
            balance: balance
          }
      }

      accountsBox = (imap accountBox accounts)

      addAccount = {
        pos: [0 (add 180 (mul (get accounts "length") 110))]
        size: [380 75]
        box: {
          cursor: "pointer"
          onClick: do => end => (do "eth" ["importPrivateKey" []] then => (end 0))
        }
        value: [
          {
            size: [48 75]
            box: {background:"rgb(68,168,237)"}
            value: {
              pos: [0 25]
              size: [48 25]
              box:  {text:{color:"rgb(235,235,250)"  align:"center" weight:300}}
              value: "+"
            }
          }
          {
            pos: [60 30]
            size: [(sub 300 60) 15]
            box: {text:{color:"rgb(70,169,237)" weight:"bold"}}
            value: "ADD ACCOUNT"
          }
        ]
      }

      {
        size:size
        box:{text:{font:"helvetica"}}
        value:[
          {
            pos:[0 42]
            size:[284 36]
            value: title
            set:{
              sep:0.5
              fst:"Accounts"
              snd:"Overview"
            }
          }
          accountsTape
          accountsBox
          addAccount
        ]
      }
  }
