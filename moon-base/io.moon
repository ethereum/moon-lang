program.
  ioAskT. ioEndT.
    caseAskT: req. args. cont. (ioAskT req args cont)
    caseEndT: ret. (ioEndT ret)
    (program t.(t caseAskT caseEndT) ioEndT)
