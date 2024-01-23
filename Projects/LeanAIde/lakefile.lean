import Lake
open Lake DSL

require LeanCodePrompts from git
  "https://github.com/siddhartha-gadgil/LeanAide"@"main"


require webeditor from git
  "https://github.com/hhu-adam/lean4web-tools.git" @ "main"

package leanAIde {
  -- add package configuration options here
}

@[default_target]
lean_lib LeanAIde {
  -- add library configuration options here
}
