min = zb2rhcMiWXCWrJDJtYVb6TWVf2YjSq4qy4vcki5uuAF5v4J9j
primitiveInput = zb2rhhi3c6Urufjp7F9m9uR3PDRXBym1Tf2d3h2PcX9Y3zuhz
renderAddress = zb2rhdkgwMJAUkUAqX9mcjNCsHx2sSHFrTyz2xiJtReKCQW9J
isChecksum = zb2rhgTfh2fo9AmE7xmkDnn3Vtm7DFQopSopYeKiDS35wWtZW
toChecksum = zb2rhnhr6fbAa5z19B1zYn5giehHmuvWGT7qGGFKxdWe5NjiU
isValid = zb2rhXEQ7G9ZseYJHosRVGFzyxf6Z2YzHkiWuY3wTkLG5EcZ5
withoutPrefix = zb2rhWtPgKPHnaZTzFV1YVoAnKyziyiu3FNbfvunH1edEzkzA
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
not = v0 => (sub 1 v0)
{
  name: "address-input"
  state: {text:""}
  args: {
    invalidIcon: size => ""
    addressIcon: size => address =>
      (renderAddress address 8 (div (get size "0") 8))
    errorColor: "rgba(208,2,27,0.1)"
    alertColor: "rgba(248,188,28,0.2)"
    normalBGColor: "rgba(0,0,0,0)"
    color: "blue"
    fontFamily: "icomoon"
  }
  child: my =>
    address = (my "text")
    w = (get (my "size") "0")
    h = (get (my "size") "1")
    isBlank = (cmp address "")
    fontFamily = (my "fontFamily")
    color = (my "color")
    isValidAddress = (isValid address)
    showError = (not (or isBlank isValidAddress))
    showAlert = (and (isValid address) (not (isChecksum address)))
    background = (if showError
      (my "errorColor")
      (if showAlert (my "alertColor") (my "normalColor"))
    )
    iconBox = {
      pos: [(mul h 0.1) (mul h 0.1)]
      size: [(mul h 0.8) (mul h 0.8)]
      child: my =>
        {
          pos: [0 0]
          size: (my "size")
          radius: (if isValidAddress (mul h 0.5) 0)
          font: {align:"center" family:fontFamily color:color}
          child: my =>
            (if isBlank
              ""
              (if isValidAddress
                (my "addressIcon" (my "size") address)
                (my "invalidIcon" (my "size"))
              )
            )
        }
    }
    inputBox = {
      pos: [h 0]
      size: [(sub w h) h]
      onHear: newAddress =>
        (do "set" {text:newAddress})>
        (do "yell" newAddress)>
        (do "stop")
      child: primitiveInput
    }
    {size:[w h] background:background child:[iconBox inputBox]}
}
