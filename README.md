# dsh-github-issues

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin that
puts the current project's GitHub repository and its issues into the right
Sidebar — and lets the agent work on them.

- **Repository at a glance** — `owner/name` (linked), branch, and the git root
  the page resolved.
- **All issues** — filter by open, closed or all, newest update first.
- **Work on them in place** — open an issue for its description, labels and
  comments, then edit, comment, close, reopen or delete it.
- **Hand off to the agent** — *Work on this* queues the issue into the current
  Session as your own request, so the agent starts on it immediately.
- **Agent tool included** — the same operations are exposed to the model as the
  `github_issues` tool, including `assign`.

## Install

The plugin is a local bundle with no dependencies and no build step.

**From the GUI:** *Settings* → *Plugins* → *Add plugin* → pick this directory.

**From an agent session:**

```
plugin_manager install_bundle  target: /absolute/path/to/dsh-github-issues
```

`application: applied` means the Host row and the Client module are live; the
page appears in a new Session.

## Open the page

1. Open the right Sidebar (its toggle sits in the conversation header).
2. Pick the **+** control in the empty strip → the guide opens.
3. Pick the **GitHub issues** card.

The plugin also adds its own glyph to the conversation header utilities, right
beside the right-Sidebar toggle: one click opens the page directly. Like any
other tab it can be floated, docked or split, and it is remembered per Session.

## Requirements

- The Session's working directory must be inside a **git work tree**.
- Its `origin` remote must be on **github.com** (ssh or https form).
- The [GitHub CLI](https://cli.github.com) (`gh`) must be installed and
  authenticated for an account that can read the repository. Reads and writes
  both go through `gh`; a missing CLI or a failing call is reported in the page.

A directory outside git, a repository without a remote, or a non-GitHub remote
each get their own explanatory state instead of an empty list.

## Layout

| Path | Role |
|---|---|
| `index.js` | Host half: authenticated `GET\|POST /api/github.issues`, git/GitHub resolution, `gh issue …` reads and mutations, agent handoff, `github_issues` tool. |
| `client.js` | Browser half: right-Sidebar tab type `github-issues` with its guide card, header button, panel UI, EN/DE dictionaries. |
| `cordis.patch.yml` | Bundle patch inserting the Host row. |
| `locale/*.json` | Plugin Manager title, description and detail document. |
| `docs/DETAIL.md` | User-facing behaviour, usage and limits. |

## Development

```sh
node --check index.js client.js   # syntax
```

`client.js` reaches a running Harness through HMR. Changes to `index.js` need a
Harness restart. The route can be probed from the Harness page:

```js
await (await fetch('api/github.issues?session=<sessionId>&state=open')).json()
```

## Limitations

- GitHub only; other forges are reported as unsupported.
- A filter lists at most the 100 newest matching issues.
- Deleting is permanent, so the panel asks for a second click.
- Issue content is fetched on demand and never written to the Session log; only
  the agent's own tool calls are.

## License

MIT — see [LICENSE](LICENSE).
