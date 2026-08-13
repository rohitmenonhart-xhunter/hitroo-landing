# Logging contract

## Event selection

| Event type  | Use when                                               | Minimum evidence                                          |
| ----------- | ------------------------------------------------------ | --------------------------------------------------------- |
| `fact`      | A stable project property is important and not obvious | One trusted source                                        |
| `decision`  | A choice was made among alternatives                   | Decision source plus rationale                            |
| `progress`  | A meaningful outcome was verified                      | Changed artifact, commit, issue, or test                  |
| `pivot`     | Goal, user, scope, or approach changed materially      | User statement, decision record, or changed plan          |
| `risk`      | A current concern can affect delivery or correctness   | Observation or failing evidence                           |
| `question`  | Missing information blocks or may change work          | Explain what evidence would resolve it                    |
| `milestone` | A meaningful checkpoint is complete                    | Verifiable artifact or release                            |
| `incident`  | A failure occurred and affected the project            | Error, issue, log reference, or user report               |
| `handoff`   | Material work needs continuity across sessions         | Outcomes, unfinished work, next actions, and safe sources |

## Confidence

| Confidence  | Meaning                                                              |
| ----------- | -------------------------------------------------------------------- |
| `confirmed` | Directly supported by a trusted source or explicit user confirmation |
| `reported`  | Stated by a source but not independently checked                     |
| `inferred`  | Reasoned from evidence and clearly labeled as inference              |
| `unknown`   | The gap itself matters, but the truth is not yet known               |

## Source examples

```json
{ "kind": "file", "ref": "docs/architecture.md" }
{ "kind": "commit", "ref": "abc1234" }
{ "kind": "test", "ref": "npm test", "claim": "42 tests passed" }
{ "kind": "user_statement", "ref": "session-2026-08-12", "claim": "Keep CLI and MCP as separate adapters" }
```

Use repository-relative paths when possible. Never use `.env`, credential files, private keys, or secret-bearing text as sources.

## Completion language

Use completion language only after verification. Otherwise record the item as unfinished or propose a question. A diff, successful command, or user confirmation is evidence. Intention is not evidence.
