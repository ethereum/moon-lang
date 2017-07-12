## Moon, a decentralized programming language

I just published the first version of [moon-lang](https://github.com/maiavictor/moon-lang). I've still not written a proper introduction to it, but, before I do, I'll talk a little bit about one of its coolest features: *decentralized imports*. Moon doesn't have a "package manager" like most languages, and Moon apps aren't meant to be hosted in normal servers. Instead, whenever you want to publish a library, program or application, you use the Ethereum/Swarm network. Here is how it works:

1. You create a cool program and name it `coolProgram.moon`.

2. You go to the terminal and type `moon publish coolProgram`.

3. The source of `coolProgram` is sent to [Swarm](http://swarm-gateways.net), a decentralized storage.

3. The `SwarmHash` is registered on [Ethereum](http://ethereum.org) using the `coolProgram` name.

4. Someone attempts to use `coolProgram` inside their own Moon code.

6. Someone attempts to reference `coolProgram` inside their own Moon program.

7. Moon follows the reverse path and recovers your source code.

7. ...?

8. Decentralized imports!

This is cool for many reasons. Not only it allow people to share code and apps as frictionless as ever, but it also gives those the same good properties of decentralized networks. If `coolProgram` is, for example, a web-application, people will immediately be able to access it on DApp browsers such as Mist. No need to worry about hosting costs, DDOS attacks, censure and so on: as long as there are people using `coolProgram`, it will be kept alive on the network!

## Example

Suppose you've written a Moon program that computes someone's [Body Mass Index](https://en.wikipedia.org/wiki/Body_mass_index) (BMI). You name it `personBMI.moon`:

```javascript
// personBMI.moon
// Computes a person's body-mass-index
person.
  weight: (get person "weight") // in kilograms
  height: (get person "height") // in meters
  (div weight (mul height height))
```

Now you're very proud of your creation and wants the world to see it, but you know nothing about hosting. No worries, Moon is here for you. But, first, you need to check if your CLI has Ether:

```bash
$ moon balance
0.07 ETH
```

If its balance is zero, don't worry. Publishing is very cheap (about $0.30 currently - quite a deal for eternity!), so you can just ask a friend to send a few Ethers to your CLI's address:

```bash
$ moon address
0x48ec2F135488C0E0F145e7689783FaE7e305a9ba
```

Once you have it, you can publish your code with `moon publish`:

```bash
$ moon publish personBMI.moon
```

You'll see a few hacky messages detailing the process:

```bash
Publishing personBMI.
- Publishing `personBMI` to Swarm...
- Done! SwarmHash: bc338bc430b923caf71c8c2680a4cce23d2d7b3d045f26159df6b47a3daa3194
- Publishing SwarmHash to Ethereum...
- Done! TxHash:  0x835019f12c61a8a3c4d5bb55024adda865f7bcc2a5a06170fa0e622ce8b134eb
- Waiting transaction confirmation (may take about 1 min)...
-- Not Yet. Waiting...
- Transaction confirmed!
- Now everyone can use your term under the name: `personBMI`.
```

And done! Now, anyone else in the world can use `personBMI` by either referencing it inside a Moon program, or by calling it directly on the terminal:

```bash
$ moon run '(personBMI {"weight": 80, "height": 1.8})'
24.691358024691358
```

Now, suppose a friend has just called him to ask if he is overweight. You could be downright honest about it… or you could write a (terminal) DApp for that!

```javascript
(cli |

  (print "What is your height, in meters?")>
  height: <getLine

  (print "What is your weight, in kilograms?")>
  weight: <getLine

  person: {
    "height": (stn height)
    "weight": (stn weight)
  }

  bmi: (personBMI person)

  (print (con "Your BMI is: " (nts bmi)))>

  exit)
```

Save it as `whatsByMBI.moon` and type `moon publish whatsMyBMI`. Now, you can just tell him to ask Moon directly:

```bash
    $ moon runIO whatsMyBMI
```

Your (terminal) DApp will be resolved on Ethereum, downloaded from Swarm and then run on your friend's console. Cool, isn't it? Try running it!

*Note: if you're confused about the fact we're using `print`s and `getLine`s in a self-proclaimed pure language, don't worry: that is just an adaptation of [Idris's bang-notation](http://docs.idris-lang.org/en/latest/tutorial/syntax.html) for monadic computations. But that's subject for another post. Check out [Moon's repository](https://github.com/maiavictor/moon-lang) for more cool stuff!*
