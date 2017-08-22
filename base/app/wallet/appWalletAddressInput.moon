emojiOf = zb2rhdjiBvMfHkm4ewHPkodmJJ5i87c85Q2w9SXs9nykkHrYm
input = zb2rhgLndDHw7EoPzXqpbnhK4uE7wshVC8giovCTJ1TngBDWy
{
  name: "ethereum-wallet-address-input"
  state: ""
  value: my =>
    min = a => b => (if (ltn a b) a b)
    address = (my "state")
    w = (get (my "size") "0")
    h = (min (get (my "size") "1") 60)
    [
      {
        pos: [h 0]
        size: [(sub w h) h]
        hear: newAddress => do => end =>
          (do "setState" newAddress then =>
          (do "yell" newAddress then => (end 0)))
        value: input
      }
      {
        pos: [0 0]
        size: [h h]
        box: {
          background: "rgb(245,244,242)"
          borders: {bottom: {size: 2, style: "solid", color: "rgb(218,217,216)"}}
        }
        value: (emojiOf address)
      }
    ]
}
