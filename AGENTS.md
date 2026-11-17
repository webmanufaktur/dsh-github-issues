# AGENTS.md — dsh-github-issues

Repository guidelines for agentic work. Workspace-wide rules live in
`~/Code/AGENTS.md`; this file adds only project-specific constraints.

## What this repository is

A DeepSeek Harness plugin bundle (`@local/github-issues`, row id
`github-issues`) that renders the project's GitHub repository and its issues in
the Harness Web UI's right Sidebar, with agent handoff. Two halves:

- `index.js` — Host: authenticated `GET|POST /api/github.issues`, git root and
  GitHub remote resolution, `gh issue` reads and mutations, `agent.followup()`
  handoff, and the `github_issues` tool.
- `client.js` — Browser: tab type `github-issues`, guide card, header button,
  panel UI, locale dictionaries, styles.

## Invariants

- **Keep the route inside the authentication fence.** Register it with
  `ctx.connection.fetch.register(...)`, never with a bare `webServer` route.
- **One operation, two callers.** Every UI action lives once in the Host
  dispatch; the `github_issues` tool calls the same function. Do not fork logic
  into the Client.
- **A handoff always starts a new Session — and only one per issue.** `assign`
  creates a Session through `ctx.sessionController.create` (Workspace-attached,
  same preset), sends the issue as its first request and returns the id so the
  Client can open it. The `owner/name#number` map and the in-flight guard keep a
  repeat click, a second panel or the agent tool from opening a second Session
  for the same issue. Never queue issue work into the asking conversation.
- **Stable contracts:** route `/api/github.issues`, tab id
  `@local/github-issues`, tab kind `github-issues`, guide entry id
  `github-issues`. Changing one breaks installed layouts.
- **Data comes from `gh` only.** No direct GitHub API calls, no scraping, no
  reading another tool's credentials.
- **Client restrictions:** no Harness Client package imports (React comes from
  the module loader), only `--dsw-alias-*` theme tokens, all visible strings
  through the `githubIssues` locale namespace, styles under `.ghi-`.
- **The Session log stays clean.** Repository and issue data never enter it;
  only the model's own tool calls do.

## Development

- No build step, no dependencies. Both halves are plain ESM/JavaScript.
- `node --check index.js client.js`.
- `client.js` changes apply through HMR; `index.js` changes need a restart.
- Do not reinstall to "apply" edits — the profile link already points here.
- Verify the route from the Harness page with an authenticated `fetch`, then
  exercise the page: filter, detail, comment, and one handoff to the agent.

## Commits

- Branch `master` only.
- Imperative subject, one concern per commit; prefixes such as `feat:`, `fix:`,
  `docs:`.
- Never commit `node_modules/` or `.DS_Store`.
