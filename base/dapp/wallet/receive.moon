tokenTable = zb2rhmmKhoSZknG3mgsYinVhiHnHWRd6e6wTfqinf3crAwgPe

receiveApp = my =>
  w = (get (my "size") "0")
  h = (get (my "size") "1")
  address = (my "address")
  {
    pos: [0 0]
    size: [w h]
    background: "rgb(250,250,250)"
    value: {
      pos: [55 40]
      size: [(sub w 110) (sub h 80)]
      set: {
        addr: address
      }
      value: tokenTable
    }
  }

receiveApp
