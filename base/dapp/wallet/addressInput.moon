min = zb2rhcMiWXCWrJDJtYVb6TWVf2YjSq4qy4vcki5uuAF5v4J9j
input = zb2rhXu3yqPyEx5nBKqATrLY8ZYLLqh5HjXQa71TzEzpWBPAa
renderAddress = zb2rhe7DnDFA13zHnhUGUjBn7nMuDhyxbdgCds24WnR9Dc2G7
addressLib = zb2rhcTJ9VEbvgij9DTfphtzza1hzTETqVQXc1948GvoAGWjM

isChecksum = zb2rhgTfh2fo9AmE7xmkDnn3Vtm7DFQopSopYeKiDS35wWtZW
toChecksum = zb2rhnhr6fbAa5z19B1zYn5giehHmuvWGT7qGGFKxdWe5NjiU
isValid = zb2rhXEQ7G9ZseYJHosRVGFzyxf6Z2YzHkiWuY3wTkLG5EcZ5
withoutPrefix = zb2rhWtPgKPHnaZTzFV1YVoAnKyziyiu3FNbfvunH1edEzkzA


do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
not = (sub 1)
{
  name: "ethereum-wallet-address-input"
  state: ""
  value: my =>
    address = (my "state")
    w = (get (my "size") "0")
    h = (min (get (my "size") "1") 40)
    isBlank = (cmp address "")
    isValidAddress = (isValid address)
    showError = (not (or isBlank isValidAddress))
    showAlert = (and (isValid address) (not(isChecksum address)))
    {
       size: [w h]
       background: (if showError 
          "rgba(208, 2, 27, 0.1)"
          (if showAlert
            "rgba(248, 188, 28, .2)"
            "rgba(0, 0, 0, 0)"
          ))
       value: [
          {
            pos: [(div h 10) (div h 10)]
            size: [(mul h 0.8) (mul h 0.8)]
            radius: (div h 2)
            value: (if isBlank
              ""
              (if isValidAddress  
                (renderAddress address 8 (div (mul h 0.8) 8)) 
                {pos: [(div h 10) (div h 10)] size: [(mul h 0.8) (mul h 0.8)] value: "⛔️"}
                )
              )
              
          }
          {
            pos: [h 0]
            size: [(sub w h) h]
            onHear: newAddress => 
              (do "setState" newAddress)>
              (do "yell" newAddress)>
              (do "stop")
            value: input
          }
          
        ]
    }
}

