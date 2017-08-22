generate = zb2rhgaF7EwthQmhaMMqTA5XZZJQyKbCzgRqKEKYHvC6ZXYJV
fn => array =>
  len = (get array "length")
  (generate 0 len i =>
    (fn i (get array (nts i))))
