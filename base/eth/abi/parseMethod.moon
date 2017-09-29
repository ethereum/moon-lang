strSplit = zb2rheqi4ntPSJQnoW8aCC7x9ydG5WBAM2dtDsQ9fDjkp36ek

sig =>
  sigPrefix = (slc sig 0 (sub (len sig) 1))
  nameArgs = (strSplit "(" sigPrefix)
  name = (get nameArgs "0")
  args = (get nameArgs "1")
  {
    name: name
    args: (strSplit "," args)
  }
