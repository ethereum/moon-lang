randomGet = zb2rhaybqbxakAWqTWG8qL5vN3BjCV4qq5gGnASiP4esLgynp

cont =>
  h = (nts (flr (mul <randomGet 360)))
  s = (con (nts (add (mul <randomGet 60) 40)) "%")
  l = (con (nts (mul (add (add (add <randomGet <randomGet) <randomGet) <randomGet) 25)) "%")
  (cont (con (con (con (con (con (con "hsl(" h) ",") s) ",") l) ")"))

