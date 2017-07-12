t.
  ioFree. ioPure.
    (t
      cont. (ioFree (ioGetLineF str.(cont str ioPure ioFree)))
      str. cont. (ioFree (ioPutLineF str (cont ioPure ioFree)))
      (ioFree ioExitT))
