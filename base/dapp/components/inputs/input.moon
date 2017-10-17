addressInput = zb2rhcv7UicBSiTEGSDFfWtfK5ffuWkdWUQzbY6pz7zLWWELY
primitiveInput = zb2rhkyUvnAg9MicAnmAfSmWk4pTJo8py42HfCJALuc27jwu5
{
  name: "input"
  value: my => (if (cmp (my "type") "address") addressInput primitiveInput)
}
