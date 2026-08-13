# Live coordination contract

Use this reference when declaring or interpreting a work session.

## State fields

| Field            | Meaning                                                                                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `objective`      | What this session is trying to accomplish now                                                                                                                                              |
| `intendedPaths`  | Narrow project-relative files, directories, or globs the session may edit                                                                                                                  |
| `touchedPaths`   | Concrete project-relative files the session has already changed                                                                                                                            |
| `device`         | Stable device identifier and optional human-readable label                                                                                                                                 |
| `harness`        | Codex, Claude, Cursor, or another execution environment                                                                                                                                    |
| `branch`         | Current source-control branch when available                                                                                                                                               |
| `workspaceLabel` | A safe label for the checkout or worktree, never an absolute local path                                                                                                                    |
| `leaseExpiresAt` | When the session automatically stops being active without a heartbeat                                                                                                                      |
| `revision`       | Optimistic-concurrency revision used to avoid lost updates                                                                                                                                 |
| `activities`     | Bounded status, question, blocker, or coordination notes for other sessions                                                                                                                |
| `workpad`        | Short shared markdown note of live findings, in-progress decisions, and next steps that other agents read; replaced whole on update, capped at 16,000 characters, deleted with the session |

## Live watch and retention

- `watch_active_work` returns the current active snapshot and a cursor. Passing that cursor again waits for a session to appear, disappear, or advance its revision.
- A cursor is not an event log. Discard it after receiving the next snapshot.
- Only the latest 20 meaningful activity notes can remain in a live checkpoint.
- Finishing a session physically deletes its checkpoint.
- An abandoned checkpoint is excluded when its lease expires and physically deleted during the next active-work observation.
- Durable proposals and approved events use a separate lifecycle and are never inferred from live presence.

## Conflict levels

- `possible`: two intended scopes overlap.
- `likely`: one session touched a file within another session's intended scope.
- `direct`: both sessions report touching the same concrete file.

These are coordination warnings, not proof of a source-control conflict. Inspect the latest repository state and communicate before writing overlapping files.

## Activity notes

Post an activity only when another session would work differently after seeing it. Valid kinds are `status`, `question`, `blocker`, and `coordination`. Keep the summary short and link related session identifiers when relevant.

Do not post command logs, file contents, prompts, transcripts, hidden reasoning, credentials, or routine narration.

## Replicated-folder observations

When the project uses a folder replicator instead of an authoritative sync node:

- treat `observedAt` as a local observation, not proof that every device has converged;
- wait for the underlying folder to report convergence before declaring no active peers;
- let only the creating device mutate or finish its live session;
- never ignore or delete a sync-conflict file automatically;
- use one reviewer device for proposal approvals and policy changes.

## Privacy rules

Publish metadata needed for coordination only. Do not publish:

- absolute filesystem paths or usernames embedded in paths;
- source code, diffs, prompts, transcripts, or command output;
- environment variables, credentials, tokens, or private keys;
- a file path outside the project root.
