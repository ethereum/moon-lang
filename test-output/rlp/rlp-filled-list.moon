either = zb2rhjDvcJ6d6xsRH5o6ZAsVmM7CGhRTZo2ADCQKtuXE4ijzy
encode = zb2rhhoXXkduCezoqZtAiNQ4Mggz1KDZBtyoagoEbRcjJEX5H
nil    = zb2rhbQFhrUA2SqQVKweLeRoHomXzJwAsKLtKT2TjW7Eunk6x
cons   = zb2rhcXRC5mtMz8yYiWuZourtH3MaZwx4m3VfDRPvvFkwpbFh
List   = (either "Left")
String = (either "Right")
filled = (List (cons (String "cat") (cons (String "dog") nil)))
(encode filled)

