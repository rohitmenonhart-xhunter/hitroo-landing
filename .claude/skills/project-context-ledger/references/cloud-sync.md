# Cloud and self-hosted sync

Use this reference when linking a project across sessions or devices.

## Isolation model

Cloud access is scoped by both the authenticated account ID and the immutable project ID from `.project-context/project.yaml`. A directory name, Git remote, or similar description is never a project identity.

The same Google account can access its own linked projects. A different account cannot access a project even if it knows the project ID. A device receives a revocable credential after browser approval. Store that credential only in the user credential file managed by the CLI.

## Pair and link

1. Initialize the project locally with `pcl init` if it does not yet contain `.project-context/project.yaml`.
2. Run `pcl cloud login --url <cloud-url>` once on each device. Let the human approve the displayed device and confirmation code in the browser.
3. Run `pcl cloud link --url <cloud-url>` inside the project on the first device. This bootstraps verified events, pending proposals, and live sessions into the account-scoped cloud project.
4. Commit `.project-context/cloud.json` with the project when project policy permits. It contains routing metadata, not a credential.
5. On another clone or session, pair the device with the same Google account. CLI and MCP adapters then resolve the cloud link automatically.

Never paste, print, commit, propose, or cite the device credential. Never silently relink a project to a different project ID or account.

## Self-hosted mode

For a private sync node, set `PCL_REMOTE_URL`, `PCL_SYNC_TOKEN`, and optionally `PCL_PROJECT_ID`. The shared bearer token must be supplied through the environment, not stored in the repository. Use TLS or a private trusted network outside local-only tests.

Cloud and self-hosted transport change persistence only. Approval rules, project schemas, logging boundaries, and live-session semantics remain the same.
