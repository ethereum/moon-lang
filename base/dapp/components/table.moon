arrayLength = zb2rhj31DmWEQi2c9stdR1r8wfFboPeFCEdXNysWKikEx3QHy
arrayStatefulGenerate = zb2rha2a3YCXKYafMCnw32uYPDaB3Naph3TtXgAkpGxSwSdxz
arrayGet = zb2rhjfCUgfysNDVs2pTuMw9Um8hRbGyYdsjKCaMTceKAGDSG
arraySum = zb2rhjoGFzi3J64cVbotEzhrvSA6L8zJzZFk53NBbLodnLsjP

params =>
  sizes = (get params "sizes")
  cell = (get params "cell")
  wrap = (get params "wrap")
  colSizes = (get sizes "rows")
  rowSizes = (get sizes "cols")
  colCount = (arrayLength colSizes)
  rowCount = (arrayLength rowSizes)
  width = (arraySum colSizes)
  height = (arraySum rowSizes)
  initial = {idx:0 pos:0}
  (wrap [width height] 
    (arrayStatefulGenerate 0 rowCount initial rowState =>
      j = (get rowState "idx")
      y = (get rowState "pos")
      h = (arrayGet rowSizes j)
      {
        state: {idx:(add j 1) pos:(add y h)}
        value: (arrayStatefulGenerate 0 colCount initial colState =>
          i = (get colState "idx")
          x = (get colState "pos")
          w = (arrayGet colSizes i)
          {
            state: {idx:(add i 1) pos:(add x w)}
            value: (cell [i j] [x y] [w h])
          }
        )
      }
    )
  )
