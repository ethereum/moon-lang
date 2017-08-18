program =>
  askT => returnT =>
    caseAskT = req => args => cont => (askT req args cont)
    caseReturnT = ret => (returnT ret)
    (program t => (t caseAskT caseReturnT) returnT)
