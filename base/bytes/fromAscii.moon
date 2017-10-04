stringFoldr = zb2rhddJhRBavTQ8iAznuNhyYHkg7bUyfp4G7i1BCnjBtyLGT
toCharCode = zb2rhXYDewvrTT2NuGawYXLfRDxwmjkdjEqLd6CvGLSwNRKuG
bytesConcat = zb2rhd8xzKmJPH4H4D8SABF547bcJy2P5ze7hmPEHJz2Pnp7N
fromU8 = zb2rhawd5pecDJ2v9wu4v3TFyeAJHHmfqpXaas4WuqJAf1f28

(stringFoldr 
  char => bytes =>
    (bytesConcat (fromU8 (toCharCode char)) bytes)
  "0x")
