io.
  ioFree. ioPure.
    (io
      req. args. cont. (ioFree (ioAskF req args (cont ioPure ioFree)))
      ret. (ioFree (ioReturnF ret)))
