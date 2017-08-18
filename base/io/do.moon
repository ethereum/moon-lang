program =>
  ioAskT => ioReturnT =>
    caseAskT = req => args => cont => (ioAskT req args cont)
    caseReturnT = ret => (ioReturnT ret)
    (program t => (t caseAskT caseReturnT) ioReturnT)
