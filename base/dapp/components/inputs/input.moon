addressInput = zb2rho5qUVhLXcAbevXp6ZMbNwNWaLgKFfGGTsuxkMXFvhDRi
primitiveInput = zb2rhgH5gRoTQN1GH4Y5RutY1RnFbCv93S8jiXiFLtTh18pQt

{
  name: "input"
  value: my =>
    (if (cmp (my "type") "address")
      addressInput
      primitiveInput)
}
