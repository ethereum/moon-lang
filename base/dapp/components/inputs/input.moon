addressInput = zb2rhY7yigvLfUjGFg3uHKUx87wu54qJbAVyG1vNiC55Zfdc9
primitiveInput = zb2rhgH5gRoTQN1GH4Y5RutY1RnFbCv93S8jiXiFLtTh18pQt

{
  name: "input"
  value: my => (if (cmp (my "type") "address") addressInput primitiveInput)
}
