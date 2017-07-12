p.
  ioGetLineT. ioPutLineT. ioExitT.
    caseGetLineT: cont. (ioGetLineT cont)
    casePutLineT: str. cont. (ioPutLineT str cont)
    caseExitT: ioExitT
    (p t.(t caseGetLineT casePutLineT caseExitT) x.ioExitT)
