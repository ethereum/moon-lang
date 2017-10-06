tokenTable = zb2rhYLvFWqWEHswxQymVb8JyE4zXjx8DWZSGerg5QFonvQWZ

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
      set: {
        addr: address
      }
      value: tokenTable
    }
  }

receiveApp
