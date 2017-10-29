map = {
     0: "0"
     1: "1"
     2: "2"
     3: "3"
     4: "4"
     5: "5"
     6: "6"
     7: "7"
     8: "8"
     9: "9"
    10: "a"
    11: "b"
    12: "c"
    13: "d"
    14: "e"
    15: "f"
}

hex = hex @ number =>
    (if (ltn number 16)
        (get map (nts number))

        (result   = (flr (div number 16))
        remainder = (mod number 16)
        (con (hex result) (hex remainder))))

encode = encode @ number =>
    (if (eql number 0)
        ("00")
        (result   = (flr (div number 256))
        remainder = (mod number 256)
        (if (eql result 0)
            (hex remainder)
            (con (hex result) (hex remainder)))))

encode
