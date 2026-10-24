#!/bin/bash
# usage: gen.sh <grid name>  — briefs/<name>.txt -> raw/<name>.png
S=$(cd "$(dirname "$0")" && pwd); mkdir -p "$S/raw"
/Users/rohit/.claude/plugins/cache/hitroo-skills/codex-imagegen/1.0.0/skills/codex-imagegen/scripts/imagegen.sh "$S/raw" "$1.png" "$(cat "$S/briefs/$1.txt")" < /dev/null
