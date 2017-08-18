req => args => cont =>
  askT => returnT =>
    (askT req args answer => (cont answer askT returnT))
