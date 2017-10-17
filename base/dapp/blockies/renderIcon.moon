randomStop = zb2rhZSKv8EAdq2VXqUA9QiMvbKogyjD4qXBZGbRCkKiFXFkj
randomGenerate = zb2rhhQFgmVVjcRf5zMHnygVmpYBXEwLufwgPEt4h3xFhmcLV
randomRun = zb2rhX8E3dmUpd1FntcdSGyH4xjjsM6ooUPGDGVi5BDaDFUEr
arrayFlatten = zb2rhdVyAPEmxC6Bumn8E4fh9aRKftYqR3FV5XxMgBHDnsuXU
createColor = zb2rhjAVPcSsSZ1DdSFtZFNihfhRJ2G9qpBEx8kviDwKdRoki

seedData => size => scale =>
  makeIcon = (|
    foreColor = <createColor
    backColor = <createColor
    spotColor = <createColor
    colors = [backColor foreColor spotColor]

    genBox = idx => rand =>
      i = (mod idx (div size 2))
      j = (flr (div idx (div size 2)))
      type = (flr (mul rand 2.3))
      color = (get colors (nts type))    
      box = i => 
        {
          pos: [(mul i scale) (mul j scale)]
          size: [scale scale]
          background: color
          value: ""
        }
      [(box i) (box (sub (sub size i) 1))]
        
    imageData = <(randomGenerate (div (mul size size) 2) genBox)

    (randomStop imageData))

  {
    name: "blockies"
    value: (arrayFlatten (randomRun seedData makeIcon))
  }
