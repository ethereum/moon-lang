addressInput = zb2rhnFjThdp5YQuN7ookdx6GYQMzB4CZFPWDF267p94VvNkZ
primitiveInput = zb2rhavZE48pZVgZrCH2hshynpLpGjac1o7uSo5P1uxxAMWQF

{
  name: "input"
  value: my =>
    (if (cmp (my "type") "address")
      addressInput
      primitiveInput)
}
