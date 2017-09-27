seed = zb2rhb71jNCBPkYVdQKqKNVFmri9RkZEaTxVoS2PZnnEueTX5
next = zb2rhf8ejQuiuervKgkQ9p7uuEk27QP6Gxor9EYMzRXguzkC3

seedData => program =>
  caseRandom = cont => seed =>
    rs = (next seed)
    (cont (get rs "rand") (get rs "seed"))
  caseStop = result => seed =>
    result
  (program caseRandom caseStop (seed seedData))
