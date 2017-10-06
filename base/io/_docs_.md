## IO in Moon

A "program" is an AST describing a computation where statements can have side-effects. In order to enable arbitrary side-effects, those are modelled as RPC-calls between the pure language and an external oracle, the host language / environment. A `Program a` is built with the constructor "`do`" followed by 1. the side-effect name (ex: `"print"`, `"prompt"`), 2. the side-effect arguments (ex: `"Hello World"`) a continuing statement. A statement consists of a function that, given the result of a previous statement, returns a `Program a`. If the side-effect name is either `"return"` or `"stop"`, specifically, the next argument must be either a value of type `a`, or nothing, respectivelly: there is no further recursion after those, they're leaves of the AST.

For example,

```
example =
  (do "prompt" "What is your name?" name =>
    (do "print" (con "Hello, " name) _ =>
      (do "stop")))
```

The program above asks the user name by making an RPC called `"prompt"` to the host environment, which is supposed to ask the user for a line of input. It then continues with a function that, given the user's name, prints it, and then continues with `(do "stop")`, which stops the program. The code above can be also written as:

```
example = |
  name = <(do "prompt" "What is your name?")
  (do "print" (con "Hello, " name))>
  (do "stop")
```

Which uses Moon's monadic notation to flatten callback-abusing code.

Formally, those are the types involved (in Idris):

```idris
type Program : Type -> Type where
  Do : (cmd : String) -> case cmd of
    "return" => a -> Program a
    "stop"   => Program a
    cmd      => paramType cmd -> (Statement (returnType cmd))

Statement returnType = (returnType -> Program a) -> Program a

paramType : String -> Type
paramType "print" = String
paramType "prompt" = String
paramType ... = ...
paramType _ = ⊥

returnType : String -> Type
returnType "print" = Unit
returnType "prompt" = String
returnType ... = ...
returnType _ = ⊥

-- Ex:
(do "print" "x" then => (do "stop")) : Program ()
(do "getLine" "x") : (String -> Program a) -> Program a
```
