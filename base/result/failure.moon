message => onFailure => onSuccess =>
  (onFailure message)


-- ALTERNATIVE --
--info = ... --io action, returns current line, name of file etc.
--message => onFailure => onSuccess =>
--  (onFailure info message)