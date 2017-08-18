f => xs => ys =>
  cons => nil =>
    (xs x => xs => c => (c x xs) c => nil
    (ys y => xs => x => c => (cons (f x y) (c xs)) x => c => nil))
