min = zb2rhcMiWXCWrJDJtYVb6TWVf2YjSq4qy4vcki5uuAF5v4J9j
primitiveInput = zb2rhavZE48pZVgZrCH2hshynpLpGjac1o7uSo5P1uxxAMWQF
renderAddress = zb2rhe7DnDFA13zHnhUGUjBn7nMuDhyxbdgCds24WnR9Dc2G7
addressLib = zb2rhcTJ9VEbvgij9DTfphtzza1hzTETqVQXc1948GvoAGWjM
isChecksum = zb2rhgTfh2fo9AmE7xmkDnn3Vtm7DFQopSopYeKiDS35wWtZW
toChecksum = zb2rhnhr6fbAa5z19B1zYn5giehHmuvWGT7qGGFKxdWe5NjiU
isValid = zb2rhXEQ7G9ZseYJHosRVGFzyxf6Z2YzHkiWuY3wTkLG5EcZ5
withoutPrefix = zb2rhWtPgKPHnaZTzFV1YVoAnKyziyiu3FNbfvunH1edEzkzA
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
not = (sub 1)

{
  name: "address-input"
  state: ""
  args: {
    invalidIcon: size => "⛔️"
    addressIcon: size => address =>
      (renderAddress address 8 (div (get size "0") 8))
    errorColor: "rgba(208,2,27,0.1)"
    alertColor: "rgba(248,188,28,0.2)"
    normalColor: "rgba(0,0,0,0)"
  }
  value: my =>
    address = (my "state")
    w = (get (my "size") "0")
    h = (get (my "size") "1")
    isBlank = (cmp address "")
    isValidAddress = (isValid address)
    showError = (not (or isBlank isValidAddress))
    showAlert = (and (isValid address) (not (isChecksum address)))
    background = 
      (if showError 
        (my "errorColor")
        (if showAlert
          (my "alertColor")
          (my "normalColor")
        )
      )
    iconBox = {
      pos: [(mul h 0.1) (mul h 0.1)]
      size: [(mul h 0.8) (mul h 0.8)]
      value: my =>
        {
          pos: [0 0]
          size: (my "size")
          radius: (if isValidAddress (mul h 0.5) 0)
          font: {align: "center"}
          value: my => 
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
        (do "setState" newAddress)>
        (do "yell" newAddress)>
        (do "stop")
      value: primitiveInput
    }
    {
      size: [w h]
      background: background
      value: [iconBox inputBox]
    }
}
