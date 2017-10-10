toCharCode = zb2rhXYDewvrTT2NuGawYXLfRDxwmjkdjEqLd6CvGLSwNRKuG

char =>
  n = (toCharCode char)
  (or
    (and (gtn n 96) (ltn n 103))
    (and (gtn n 47) (ltn n 58)))
