import Lake
open Lake DSL

require mil from git
  "https://github.com/leanprover-community/mathematics_in_lean"@"master"

require webeditor from git
  "https://github.com/hhu-adam/lean4web-tools.git" @ "main"

package mathematicsInLean {
  -- add package configuration options here
}

@[default_target]
lean_lib MathematicsInLean {
  -- add library configuration options here
}
