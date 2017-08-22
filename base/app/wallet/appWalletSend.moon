title = zb2rhomap7bxY5r3d31orywF5KwCjrh9Y8HVypyJHmRAZ6Ep8
label = zb2rhZJn7kui3snsZbkgNG9tpd6hK5yiTLCgoZea7BkMMZzWd
input = zb2rhgLndDHw7EoPzXqpbnhK4uE7wshVC8giovCTJ1TngBDWy
addressInput = zb2rhdN6xGWefwL1LwxJfwx6NpRYjA95EWefWKgr4NjZpW7Ro
{
  name: "ethereum-wallet-send"
  state: {
    from: ""
    to: ""
    amount: ""
    result: ""
  }
  value: my =>
    state = (my "state")
    size = (my "size")
    w = (get size "0")
    h = (get size "1")
    iw = (sub w (mul 60 2))
    ih = h
    iw2 = (div iw 2)

    updateFrom = from => state =>
      {
        from: from
        to: (get state "to")
        amount: (get state "amount")
        result: ""
      }

    updateTo = to => state =>
      {
        from: (get state "from")
        to: to
        amount: (get state "amount")
        result: ""
      }

    updateAmount = amount => state =>
      {
        from: (get state "from")
        to: (get state "to")
        amount: amount
        result: ""
      }

    updateResult = result => state =>
      {
        from: (get state "from")
        to: (get state "to")
        amount: (get state "amount")
        result: result
      }

    titleBar = {
      pos: [0 42]
      size: [164 36]
      value: title
      set: {sep: 0.5 fst: "Send" snd: "funds"}
    }

    fromBox = {
      pos: [0 150]
      size: [(sub iw2 8) 66]
      hear: from => do => end => (do "setState" (updateFrom from state) then => (end 0))
      name: "from"
      value: label
      set: {
        label: "FROM"
        thing: addressInput
      }
    }

    toBox = {
      pos: [(add iw2 8) 150]
      size: [(sub iw2 8) 66]
      hear: to => do => end => (do "setState" (updateTo to state) then => (end 0))
      name: "to"
      value: label
      set: {
        label: "TO"
        thing: addressInput
      }
    }

    amountBox = {
      pos: [0 280]
      size: [(sub iw2 8) 66]
      hear: amount => do => end => (do "setState" (updateAmount amount state) then => (end 0))
      value: label
      set: {
        label: "AMOUNT"
        thing: {
          box:{background:"rgb(200,200,200)"}
          set:{paddings:{left:8, right:8}}
          value: input
        }
      }
    }

    unitBox = {
      pos: [(add iw2 8) 280]
      size: [(sub iw2 8) 66]
      value: label
      set: {
        label: ""
        thing: 
          {
            box:{text:{color:"rgb(120,120,120)"}}
            value: my =>
              w = (get (my "size") "0")
              h = (get (my "size") "1")
              y = 6
              h2 = (sub h (mul y 2))
              w2 = (div w 2)
              [
                {
                  pos:[0 y]
                  size:[w2 h2]
                  value:"Ξ ETHER"
                }
                {
                  pos:[w2 y]
                  size:[w2 h2]
                  box:{text:{align:"right"}}
                  value:(con (con (slc (nts (stn (get state "amount"))) 0 10) " ") "ETHER")
                }
              ]
          }
      }
    }

    sendButton = {
      pos: [0 410]
      size: [140 54]
      box: {
        cursor: "pointer"
        background: "rgb(68,168,237)"
        radius: 2
        borders:{bottom:{size:3 style:"solid" color:"rgb(60,151,212)"}}
        onClick: do => end =>
          tx = {
            from: (get state "from")
            to: (get state "to")
            value: (get state "amount")
          }
          (do "setState" (updateResult "" state) then =>
            (do "eth" ["sendTransaction" tx] result =>
              (do "setState" (updateResult result state)
                then => (end 0))))
      }
      value: {
        pos: [0 18]
        size: [140 16]
        box: {text: {color:"rgb(250,250,250)" align:"center"}}
        value: "SEND"
      }
    }

    resultText = {
      pos: [156 430]
      size: [(sub w 156) 16]
      value: (get state "result")
    }

    {
      pos: [0 0]
      size: size
      box: {text:{font:"helvetica"}}
      value:
        {
          type: "box"
          pos: [60 0]
          size: [iw ih]
          value: [
            titleBar
            fromBox
            toBox
            amountBox
            unitBox
            sendButton
            resultText
          ]
        }
    }
}
