ioReturnF = zb2rhnK8RB4JSYZVjcQExd2cbkff6NBStJp21u7Nmwh8MXjPo
askF = zb2rhePPqh6nsZvzid7Rcp64wpbbe9K3Pu4j2ZaisYRSPPvDT
io =>
  ioFree => ioPure =>
    (io
      req => args => cont => (ioFree (askF req args (cont ioPure ioFree)))
      ret => (ioFree (ioReturnF ret)))
