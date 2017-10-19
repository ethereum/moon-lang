hex       = zb2rharDMysVfBLa85qhQ26X5QVYcjFAzmaRzyWZpGVS7sLqw
either    = zb2rhjDvcJ6d6xsRH5o6ZAsVmM7CGhRTZo2ADCQKtuXE4ijzy
fromAscii = zb2rhoav2oVBSU3zQ3Yu1yZqUPcDFwLzxw2bG8NZqKWf4RVUj
listLen   = zb2rhkJDV8HhymAXk4fQNN4JVMSXxxeQv8xKRvTzDY2RnShPr

Left      = (either "Left")
Right     = (either "Right")
case      = (either "case")

string2hex = string =>
    bytes  = (fromAscii string)
    length = (len bytes)
    (slc bytes 2 length)

encodeLength = number => offset =>
    (if (ltn number 56)
        (hex (add offset number))
        (binary  = (hex number)
        length   = (len binary)
        const    = (add 55 offset)
        prefix   = (add length const)
        hxprefix = (hex prefix)
        (con hxprefix binary)))

encodeString = text =>
    (if (cmp text "")
        ("80")
        (length = (len text)
        prefix = (encodeLength length 128)
        hexstr = (string2hex text)
        (con prefix hexstr)))

encodeList = encode => list =>
    length = (listLen list)
    (if (eql length 0)
        ("c0")
        (end = ""
         val = (first => second =>
            firstHex = (encode first)
            (con firstHex second))

        hex      = (list val end)
        length   = (div (len hex) 2)         // characters aren't escaped, so our hex byte is 2 chars-size
        prefix   = (encodeLength length 192)
        (con prefix hex)))

encodeSum = encode @ tree =>
    (case tree {
        Left:  (encodeList encode)
        Right: encodeString
    })

encode = tree =>
    (con "0x" (encodeSum tree))

encode
