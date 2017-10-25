renderIcon = zb2rhoodYdbW97cJ1nce2LuvSjjhjdnAnjY4MmVDw66jHLfH9
addressToSeed = zb2rhgzZSguVZUaW8SuSBogycBpaAJCYnRiURf875nCKtQbrA

address => size => scale =>
  {
    name: "blockies-address"
    cache: (con address (con "_" (con (nts size) (con "_" (nts scale)))))
    child: my => (renderIcon (addressToSeed address) size scale)
  }
