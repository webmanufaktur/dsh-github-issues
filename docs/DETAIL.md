# GitHub issues

A right Sidebar page that tells you what project you are in and lets you work on
its GitHub issues without leaving the Session.

## What it shows

- The repository containing the Session's working directory: name, owning
  account, current branch, and the git root it resolved.
- Every issue of that repository, filtered by open, closed, or all, newest
  update first.
- One issue opened in place: description, labels, author, and its comments.

## Opening it

- **One click:** pick the GitHub glyph in the conversation header utilities,
  beside the right Sidebar's own toggle. It opens the page and expands the
  column.
- **Through the guide:** open the right Sidebar, pick the **+** control in the
  empty strip to open the guide, then pick the **GitHub issues** card.

The page is an ordinary tab, so it can be floated, docked, or split like any
other; it stays open per Session.

## What you can do

| Action | Result |
|---|---|
| New issue | Creates an issue with a title and description. |
| Edit | Rewrites the title and/or the description. |
| Comment | Adds a comment to the issue. |
| Close / Reopen | Changes the issue state. |
| Delete | Deletes the issue permanently, after a confirmation. |
| Work on this | Starts a new Session in the same project with the issue as its first request and opens it. Each issue has one such Session; clicking again opens the existing one. |

The agent has the same operations through the `github_issues` tool, including
`assign`, so a handoff can also be requested in conversation; it creates a new
Session the same way.

## Requirements and limits

- `git` resolves the repository from the Session's working directory, so a
  project that is not a git work tree shows an explanatory empty state instead
  of a list.
- Only GitHub remotes are supported. A different host, or a repository without
  a remote, is reported as such.
- Issue data comes from the GitHub CLI (`gh`). It must be installed and
  authenticated for the account that owns the remote; failures are shown with
  the CLI's message.
- A filter lists at most the 100 newest matching issues.
- Reads are fetched on demand and cached only in the page's memory: no issue
  content is written to the Session log.
- Deleting is permanent and cannot be undone from the panel.
