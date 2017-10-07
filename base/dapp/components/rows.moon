arrayGet = zb2rhjfCUgfysNDVs2pTuMw9Um8hRbGyYdsjKCaMTceKAGDSG
table = zb2rhbQDhNX5zVrZXQZ4xKm2uHqbE8pDZmTYQongnEBvf7d9t

params =>
  sizes = (get params "sizes")
  lines = (get params "lines")
  (table {
    sizes: sizes
    cell: idx => pos => size =>
      i = (get idx "0")
      j = (get idx "1")
      {
        pos: pos
        size: size
        value: (arrayGet (arrayGet lines j) i)
      }
  })

