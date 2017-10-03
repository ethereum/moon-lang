shiftr = zb2rhjBmuz6CmkbbzwtndbiietAq4jzi8JAxFoy1fUGDcxZeT
num => bits =>
  (or (shiftr num bits) (if (ltn (or num 0) #(pow 2 31)) 0 (mul (sub (pow 2 bits) 1) (pow 2 (sub 32 bits)))))
