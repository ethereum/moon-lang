addressInput = zb2rhc7knKY19pDeoXQkEroHfPc7hn6QYCM75wxdJ8143Hnzc
primitiveInput = zb2rhZW1hEgTFfTA2KWt3TzZcr9hqVxvnC6XXvYBhyiQQkfis

my => {
  value: (if (cmp (my "type") "address")
    addressInput
    primitiveInput)
}
