case = datatype => dispatch =>
    onLeft  = (get dispatch "Left")
    onRight = (get dispatch "Right")

    (datatype onLeft onRight)

case
