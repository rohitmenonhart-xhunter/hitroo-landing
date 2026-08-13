---
name: project-context-ledger
description: Maintain autonomous Markdown-first, per-project continuity and coordinate live work across devices and agent sessions with ContextJoin MCP or CLI tools. Use on EVERY turn of material work in a project containing `.project-context` — start of turn, immediately when a conflict-relevant change or confirmed decision happens mid-turn, and compulsorily at end of turn — plus when onboarding an existing project into the ledger, linking the same project across devices, or moving work between Codex, Claude, Cursor, or another harness. Do not use for casual questions, routine command output, raw transcripts, secrets, or unverified work.
---

# ContextJoin

Keep the approved Markdown project handbook current without turning it into a transcript or an unreviewed memory dump. The readable memory lives in `.project-context/views/*.md`; structured records exist to compile, review, synchronize, and protect those views.

## Onboard an existing project

When the ledger is initialized in an existing project, actually read the project before writing context:

1. Run `contextjoin setup` with a factual name and short description when setup has not already completed. Never reuse a project ID from another project. Setup reports which Markdown documentation it detected.
2. **If Markdown documentation exists** (README, `docs/`, ARCHITECTURE, CONTRIBUTING, agent instruction files): read those files and distill them into the initial handbook — purpose fact, confirmed architecture decisions, active risks, current focus — one record per independent claim, each citing the source file. The handbook must agree with what the docs actually say, not with assumptions.
3. **If no Markdown documentation exists**: you author the central base for that folder yourself. Explore the manifests, directory structure, entry points, tests, and recent Git state, then record the project purpose, the observed architecture, and the current focus. Those compiled views become the folder's base documentation from that moment on.
4. Record only evidence-backed items. Do not convert code observations into product intent unless a source supports them; the user can revert anything wrong.
5. Exclude raw Git history, transcripts, prompts, hidden reasoning, generated build output, credentials, and secret-bearing files.
6. For user onboarding, prefer the idempotent `contextjoin setup`. The lower-level `install-agent`, `init`, `cloud login`, and `cloud link` commands are advanced recovery tools.

Initialization creates local context first. Read [cloud-sync.md](references/cloud-sync.md) when the project should work across machines or use a self-hosted sync node.

## The turn protocol — every turn, no exceptions

Session and activity detection must be flawless; other agents can only coordinate with what you publish. Every turn of material work interacts with the engine. Never let a turn pass silently.

- **Turn start.** First turn of a task: `get_brief`, then `start_work` (save the session ID for the whole task). Every later turn: `heartbeat_work` first (it also revives a session whose lease lapsed while you were thinking), and `watch_active_work` with your last cursor and `sessionId` when other agents are active.
- **Immediately, mid-turn — do not defer to the end of the turn:**
  - `update_work` with the touched file the moment you first edit any file that a directive or conflict warning mentioned, or that lies inside another session's intended scope;
  - record a decision, pivot, or incident the moment it is confirmed if another active agent could act on it before your turn ends;
  - post a `blocker` note the moment you become blocked on another session.
- **Turn end — compulsory.** `update_work` with every remaining touched file and a refreshed workpad. If the task is complete: `close_session` then `finish_work`. If not: leave the session alive with a heartbeat.
- **Recovery.** If any tool says the session is gone, immediately `start_work` again with the same objective and re-declare touched paths. Never keep editing without a live session.

## Start material work

1. Call `get_brief` with the current task and a 2,000-token budget. The brief includes an "Active agents right now" section — read it: it tells you what every other running agent is doing, touching, and thinking.
2. Treat the result as approved project context, not as a substitute for inspecting current code or cited sources.
3. Before material edits, call `start_work` with your objective, stable device identity, harness, branch when known, and the narrowest honest project-relative paths you may touch. Save the returned session identifier.
4. Every work tool response can contain `DIRECTIVE` lines. Obey them: they are the system actively steering you around other running agents. A direct-conflict directive means stop editing that file until you have coordinated; a peer-workpad directive means read that workpad before duplicating work.
5. If an overlap is reported, coordinate or narrow scope before editing. A warning is not a lock and does not grant permission to overwrite another session.
6. Call `query_context`, `get_decision`, or `get_shared_context` only when the task needs deeper history or the full live picture.
7. If the MCP tools are unavailable, use `pcl brief`, `pcl work list`, and `pcl work start` when the CLI is installed. For CLI writes, identify yourself with `--actor-kind agent --actor <harness-name>`. Represent user evidence with a safe `--source user_statement:<reference>` instead of claiming the human created the proposal. Otherwise state that project context or coordination could not be loaded.
8. If `.project-context/cloud.json` exists and the device is not paired, stop material writes and ask the user to complete `pcl cloud login --url <cloud-url>`. Never copy a device token into chat, project files, logs, or agent context.

## Negotiate, don't duplicate

Seeing another agent is not enough — you must talk to each other and split the work. Two directives demand an immediate conversation:

- **`SAME OBJECTIVE`** — another session is chasing the same goal. Stop before editing. Send a coordination note proposing a concrete split ("I take the layout and links, you take the contact affordances?") addressed to their session (`relatedSessionIds`), then `watch_active_work` with your cursor until their reply note arrives. Write the agreed plan at the top of BOTH your workpads, then work only inside your share.
- **`MESSAGE`** — a peer sent a note addressed to your session. Replying is your first duty of the turn: answer with a coordination note before touching any file. If they proposed a split, accept or counter concretely — never ignore.

The engine enforces the handshake: adding a touched file that a peer already touched is **rejected** until one of you has sent the other a note. When you receive that rejection, follow its instructions — note first, agree, then edit. One agent finishing its share posts a status note so the other can take over the remainder.

## Maintain live coordination

Read [live-coordination.md](references/live-coordination.md) when choosing path scopes, interpreting overlap levels, or handling device privacy.

- Call `update_work` after touching files, and before expanding into paths outside the declared scope.
- Keep your **workpad** current through `update_work`: a short markdown note (what you have figured out so far, decisions in progress, what you will do next, what you need from other agents). Other agents read it to build on your work instead of redoing it. Update it when your understanding changes, not on every edit. Never put code, transcripts, secrets, or absolute paths in it.
- When another agent's session is active, read their workpad (in `get_brief`, `get_shared_context`, or directive lines) before working near their scope, and shape your plan around what they already learned.
- Call `watch_active_work` with the last returned cursor and your own `sessionId` when another active session may change your plan. Treat the result as a current checkpoint, not as activity history.
- Add one short structured activity when the target changes, work becomes blocked, another session must respond, or an overlap needs coordination. Do not narrate routine progress.
- Record project-relative file paths only. Never publish absolute local paths, secrets, command output, file contents, or conversation text.
- Call `heartbeat_work` during long work before the current lease expires.
- Treat live sessions as ephemeral coordination, not approved project truth or proof that work completed.
- Recheck `list_active_work` before a broad refactor, merge, migration, or shared configuration change.

## Decide what deserves a durable proposal

Propose an event only when it will help a future person or agent work correctly. Read [logging-contract.md](references/logging-contract.md) when selecting an event type or confidence.

Good candidates include:

- a user-confirmed product or architecture decision;
- a pivot in goal, audience, scope, or approach;
- verified progress or a completed milestone;
- a newly discovered risk, blocker, incident, or open question;
- a stable project fact that is not obvious from the repository;
- a correction or replacement for previously approved context.

Do not log:

- raw conversation transcripts;
- secrets, tokens, credentials, private keys, or sensitive source files;
- commands run, files opened, or other routine activity;
- plans as though they were completed outcomes;
- guesses as confirmed facts;
- details already obvious from generated code unless the reasoning matters.

## Record durable events — autonomously and sparingly

This context engine is autonomous. **Never ask the user for permission to record context, and never surface proposals, approvals, or review requests to them.** `record_event` and `close_session` commit to the handbook automatically and recompile the views.

Autonomy is not verbosity. Record spam is a product failure: the normal session produces **one** `close_session` handoff, nothing more. Create separate events only for a genuine decision, pivot, incident, or risk. Never record routine progress, setup steps, or anything obvious from the repository.

The user's safety net is revert, not review:

- Every record is undoable. If the user says something recorded is wrong, call `revert_event` with their exact words as `userQuote` — the event vanishes from current views while the timeline keeps an audit record.
- Mention new record IDs briefly in your reply (one line, no question) so the user always knows what entered the handbook and can revert it.
- Never call `revert_event` on your own initiative; reverting is the user's decision.

Rules for the records themselves: absolute timestamps; at least one safe source for `decision`, `pivot`, and `fact`; `confirmed` only for user-approved or directly supported claims; link replacements with `supersedes`; summaries factual and compact with reasoning in `rationale`.

## Close material work

After verified work with durable project impact:

1. Record any separate decision, pivot, risk, question, or milestone first.
2. Call `close_session` with:
   - what actually happened;
   - verified outcomes;
   - unfinished work;
   - concrete next actions;
   - safe evidence such as changed files, commits, issues, or test commands and results.
3. Keep the handoff short enough for the next agent to scan quickly.
4. Call `finish_work` for the live session even when no durable handoff is needed.
5. Mention the recorded handoff ID in one line of your reply so the user can revert it if needed.

Skip `close_session` when the interaction produced no material project change, but still finish an active live session.

## Handle conflicts and uncertainty

- Preserve conflicting claims and record a `question` or `risk` instead of choosing one without evidence.
- Inspect a cited source before relying on a high-impact claim.
- Use `check_context` when context appears stale, contradictory, or incomplete.
- When the user says a recorded item is wrong, revert it with `revert_event` (their exact words as `userQuote`) or supersede it with a corrected record — never silently rewrite history.
