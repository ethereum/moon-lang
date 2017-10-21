addressInput = zb2rhheDez5rT7kU8Eu6jwGqVZjds5n6nnBFGgi8ZpnN3R2vb
primitiveInput = zb2rhj2tAGJ7auyZX3bNa52xdEz26VQoL9BJ3S9xxYWTda99E

{
  name: "input"
  value: my => (if (cmp (my "type") "address") addressInput primitiveInput)
}
