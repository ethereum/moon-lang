either = zb2rhjDvcJ6d6xsRH5o6ZAsVmM7CGhRTZo2ADCQKtuXE4ijzy

Left  = (either "Left")
Right = (either "Right")
case  = (either "case")

value = (Right 5)

(case value {
    Left:  (number => (add number 1))
    Right: (number => (mul number 2))
})
