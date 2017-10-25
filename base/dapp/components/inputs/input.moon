addressInput = zb2rhYqoX1WDU4WXmY6nVTL3jKeaZaeZ63m1PVJ5phNHhioUj
primitiveInput = zb2rhhi3c6Urufjp7F9m9uR3PDRXBym1Tf2d3h2PcX9Y3zuhz

{
  name: "input"
  child: my => (if (cmp (my "type") "address") addressInput primitiveInput)
}
