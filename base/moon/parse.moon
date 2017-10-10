toCharCode = zb2rhXYDewvrTT2NuGawYXLfRDxwmjkdjEqLd6CvGLSwNRKuG

Cons = head => tail => Cons => Nil => (Cons head tail)
Nil = Cons => Nil => Nil
foldr = foldr @ list => cons => nil =>
  caseCons = head => tail => (cons head (foldr tail cons nil))
  caseNil = nil
  (list caseCons caseNil)
foldl = foldl @ list => cons => nil =>
  caseCons = head => tail => (foldl tail cons (cons head nil))
  caseNil = nil
  (list caseCons caseNil)
reverse = list =>
  (foldl list Cons Nil)

between = min => max => x =>
  (and 
    (or (gtn x min) (eql x min))
    (or (ltn x max) (eql x max)))

isWord = char =>
  code = (toCharCode char)
  (or
    (between 65 90 code)
    (or 
      (between 48 57 code)
      (between 97 122 code)))

App = fun => arg   => App => Lam => Var => (App fun arg)
Lam = name => body => App => Lam => Var => (Lam name body)
Var = name         => App => Lam => Var => (Var name)

fold = fold @ term => ctors =>
  App = fun => arg => (get ctors "App" (fold fun ctors) (fold arg ctors))
  Lam = name => body => (get ctors "Lam" (fold name ctors) (fold body ctors))
  Var = name => (get ctors "Var" name)
  (term App Lam Var)

stringify = term =>
  (fold term {
    App: fun => arg => (con "(" (con fun (con " " (con arg ")"))))
    Lam: name => body => (con name (con " => " body))
    Var: name => name
  })

parse = code =>
  str = (con "(" (con code ")"))

  parse = parse @ i => parses =>
    char = (slc str i (add i 1))

    (if (cmp char " ")
      (parse (add i 1) parses)

    (if (isWord char)
      getWord = getWord @ i => word =>
        char = (slc str i (add i 1))
        (if (and (ltn i (len str)) (isWord char))
          (getWord (add i 1) (con word char))
          (parse i (Cons (Var word) parses)))
      (getWord i "")

    (if (cmp char "(")
      parsed = (parse (add i 1) parses)
      idx = (get parsed "idx")
      val = (get parsed "val")
      (parse idx (Cons val parses))

    (if (cmp char "=")
      (parses
        bind => parses =>
          parsed = (parse (add i 2) parses)
          (parse 
            (get parsed "idx")
            (Cons (Lam bind (get parsed "val")) parses))
        "...")

      {
        idx: i
        val: 
          (parses
            head => tail =>
              caseCons = fun => arg => (App (arg fun))
              caseNil = lastFun => lastFun
              (foldr tail caseCons caseNil head)
            (Var "err"))
      }))))

  (get (parse 0 Nil) "val")
        

(stringify (parse "f => a b (x y z) (t u v) c d"))

//(c F (c E (c D (c C (c B (c A n)))))) -> (a (a (a (a (a F E) D) C) B) A)

//const parse = code => {
  //let s = "(" + code + ")";
  //let i = 0;
  //const parseBind = () => {
    //let parses = [];
    //while (s[i]) {
      //while (/\s/.test(s[i])) {
        //++i;
      //};
      //if (/\w/.test(s[i])) {
        //let word = "";
        //while (s[i] && /\w/.test(s[i])) {
          //word += s[i++];
        //}
        //parses.push(["Var", word]);
      //} else if (/\(/.test(s[i])) {
        //const term = (++i, parseBind());
        //parses.push((++i, term));
      //} else if (/(=>|->)/.test(s.slice(i,i+2))) {
        //const bind = parses.length > 1 ? parses.pop() : ["Var", ""];
        //const type = parses.pop();
        //parses.push([s.slice(i,i+=2) === "=>" ? "Lam" : "All", type, bind, parseBind()]);
      //} else if (/\)/.test(s[i])) {
        //break;
      //}
    //};
    //return parses.reduce((parse, result) => ["App", parse, result]);
  //};
  //return parseBind();
//};
