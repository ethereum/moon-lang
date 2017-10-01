init = edit => var => tup =>
  (edit tup var)

more = tup => edit => var =>
  (tup tup => vars => (edit tup var vars))

n =>
  (for 1 n init i => more x => x)