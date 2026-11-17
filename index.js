/**
 * Host half of the github-issues bundle.
 *
 * One authenticated JSON endpoint, `/api/github.issues`, backs the right
 * Sidebar page: it resolves the git repository containing the Session's working
 * directory, reads its GitHub remote, and runs `gh issue …` for reads and
 * mutations. The same operations are exposed to the model through the
 * `github_issues` tool, so the UI and the agent path share one implementation.
 *
 * Project data never enters the Session log; only the model's own tool calls
 * do.
 */
import { execFile } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { delimiter, join } from 'node:path'

/** Loader row id; also the name shown in bundle diagnostics. */
export const name = 'github-issues'

/** The route lives inside the connection authentication fence. */
export const inject = ['connection', 'tools', 'sessions', 'workingDirectory', 'agents']

const ROUTE = '/api/github.issues'
const TIMEOUT_MS = 20_000
const MAX_BUFFER = 16 * 1024 * 1024
const LIST_LIMIT = 100
const LIST_FIELDS = ['number', 'title', 'state', 'author', 'labels', 'url', 'createdAt', 'updatedAt']
const VIEW_FIELDS = [...LIST_FIELDS, 'body', 'comments', 'stateReason']

/** State filters the page offers. */
const STATES = new Set(['open', 'closed', 'all'])

let resolvedGh

/** Locate the `gh` executable without trusting the GUI process PATH. */
function ghBinary() {
  if (resolvedGh !== undefined) return resolvedGh
  const candidates = [
    process.env.GH_BIN,
    '/opt/homebrew/bin/gh',
    '/usr/local/bin/gh',
    join(homedir(), '.local/bin/gh'),
    '/usr/bin/gh',
  ]
  for (const candidate of candidates) {
    if (typeof candidate !== 'string' || candidate.length === 0) continue
    if (candidate === 'gh') continue
    if (existsSync(candidate)) {
      resolvedGh = candidate
      return candidate
    }
  }
  // Fall back to a PATH lookup: execFile resolves a bare name through PATH.
  const pathParts = String(process.env.PATH ?? '').split(delimiter).filter(Boolean)
  for (const part of pathParts) {
    const candidate = join(part, 'gh')
    if (existsSync(candidate)) {
      resolvedGh = candidate
      return candidate
    }
  }
  resolvedGh = 'gh'
  return resolvedGh
}

/** Run one command and resolve with its stdout. */
function run(file, args, options = {}) {
  return new Promise((resolve, reject) => {
    execFile(
      file,
      args,
      {
        timeout: TIMEOUT_MS,
        maxBuffer: MAX_BUFFER,
        env: process.env,
        ...options,
      },
      (error, stdout, stderr) => {
        if (error !== null) {
          const detail = String(stderr ?? '').trim() || error.message
          const wrapped = new Error(detail)
          wrapped.code = error.code
          reject(wrapped)
          return
        }
        resolve(String(stdout))
      },
    )
  })
}

/** Run `gh` with JSON output. */
async function gh(args, options) {
  let stdout
  try {
    stdout = await run(ghBinary(), args, options)
  } catch (error) {
    // A missing executable is a machine setup problem, not a GitHub failure.
    if (error?.code === 'ENOENT') {
      throw Object.assign(new Error('gh executable not found'), { code: 'gh-missing' })
    }
    throw error
  }
  const text = stdout.trim()
  if (text.length === 0) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/** Run `git` and return trimmed stdout, or undefined when it fails. */
async function git(cwd, args) {
  try {
    const stdout = await run('git', ['-C', cwd, ...args])
    return stdout.trim()
  } catch {
    return undefined
  }
}

/**
 * Read `owner/repo` from a GitHub remote URL.
 * @param {string} url - any clone URL form git prints for `origin`.
 * @returns {{ owner: string, name: string, slug: string } | undefined}
 */
function parseGitHubRemote(url) {
  if (typeof url !== 'string' || url.length === 0) return undefined
  const patterns = [
    /^git@github\.com:([^/]+)\/(.+?)(?:\.git)?$/i,
    /^ssh:\/\/git@github\.com\/([^/]+)\/(.+?)(?:\.git)?$/i,
    /^https?:\/\/github\.com\/([^/]+)\/(.+?)(?:\.git)?$/i,
    /^git:\/\/github\.com\/([^/]+)\/(.+?)(?:\.git)?$/i,
  ]
  for (const pattern of patterns) {
    const match = pattern.exec(url)
    if (match !== null) {
      const owner = match[1]
      const repo = match[2].replace(/\/+$/, '')
      if (owner.length > 0 && repo.length > 0) return { owner, name: repo, slug: `${owner}/${repo}` }
    }
  }
  return undefined
}

/** Resolve the Session and the directory it works in. */
function sessionDirectory(ctx, sessionId) {
  if (typeof sessionId !== 'string' || sessionId.length === 0) {
    throw Object.assign(new Error('missing session id'), { code: 'no-session' })
  }
  const session = ctx.sessions.get(sessionId)
  if (session === undefined) {
    throw Object.assign(new Error(`unknown session ${sessionId}`), { code: 'no-session' })
  }
  return ctx.workingDirectory.get(session)
}

/** Find the git root and its GitHub remote for one directory. */
async function resolveRepository(ctx, sessionId) {
  const directory = sessionDirectory(ctx, sessionId)
  const root = await git(directory, ['rev-parse', '--show-toplevel'])
  if (root === undefined || root.length === 0) {
    return { ok: false, code: 'no-git', directory }
  }
  const remote = await git(root, ['config', '--get', 'remote.origin.url'])
  const parsed = parseGitHubRemote(remote)
  const branch = await git(root, ['rev-parse', '--abbrev-ref', 'HEAD'])
  if (parsed === undefined) {
    return {
      ok: false,
      code: remote === undefined ? 'no-remote' : 'not-github',
      directory,
      root,
      remote: remote ?? null,
    }
  }
  return {
    ok: true,
    repo: {
      root,
      directory,
      name: parsed.name,
      owner: parsed.owner,
      slug: parsed.slug,
      url: `https://github.com/${parsed.slug}`,
      branch: branch ?? null,
      remote: remote ?? null,
    },
  }
}

/** Shape one issue row for the page and the model. */
function projectIssue(issue) {
  const labels = Array.isArray(issue.labels) ? issue.labels : []
  return {
    number: issue.number,
    title: String(issue.title ?? ''),
    state: String(issue.state ?? 'open').toLowerCase(),
    url: String(issue.url ?? ''),
    author: issue.author?.login ?? null,
    labels: labels.map(label => ({ name: String(label.name ?? ''), color: String(label.color ?? '') })),
    createdAt: issue.createdAt ?? null,
    updatedAt: issue.updatedAt ?? null,
  }
}

/** Shape one issue including body and comments. */
function projectIssueDetail(issue) {
  const comments = Array.isArray(issue.comments) ? issue.comments : []
  return {
    ...projectIssue(issue),
    body: String(issue.body ?? ''),
    stateReason: issue.stateReason ?? null,
    comments: comments.map(comment => ({
      author: comment.author?.login ?? null,
      body: String(comment.body ?? ''),
      createdAt: comment.createdAt ?? null,
    })),
  }
}

/** List issues for one repository. */
async function listIssues(ctx, request) {
  const repo = await resolveRepository(ctx, request.sessionId)
  if (!repo.ok) return repo
  const state = STATES.has(request.state) ? request.state : 'open'
  const issues = await gh([
    'issue', 'list',
    '--repo', repo.repo.slug,
    '--state', state,
    '--limit', String(LIST_LIMIT),
    '--json', LIST_FIELDS.join(','),
  ])
  const rows = Array.isArray(issues) ? issues.map(projectIssue) : []
  return { ok: true, repo: repo.repo, state, issues: rows }
}

/** Read one issue with body and comments. */
async function viewIssue(ctx, request) {
  const repo = await resolveRepository(ctx, request.sessionId)
  if (!repo.ok) return repo
  const number = Number(request.number)
  if (!Number.isInteger(number) || number <= 0) return { ok: false, code: 'bad-number', error: 'issue number required' }
  const issue = await gh([
    'issue', 'view', String(number),
    '--repo', repo.repo.slug,
    '--json', VIEW_FIELDS.join(','),
  ])
  if (issue === null || typeof issue !== 'object') return { ok: false, code: 'not-found', error: `issue #${number} not found` }
  return { ok: true, repo: repo.repo, issue: projectIssueDetail(issue) }
}

/** Mutate one issue through `gh`, then report its new state. */
async function mutateIssue(ctx, request) {
  const repo = await resolveRepository(ctx, request.sessionId)
  if (!repo.ok) return repo
  const number = Number(request.number)
  if (!Number.isInteger(number) || number <= 0) return { ok: false, code: 'bad-number', error: 'issue number required' }
  const target = ['--repo', repo.repo.slug]
  switch (request.action) {
    case 'close':
      await gh(['issue', 'close', String(number), ...target, '--reason', request.reason === 'not planned' ? 'not planned' : 'completed'])
      break
    case 'reopen':
      await gh(['issue', 'reopen', String(number), ...target])
      break
    case 'comment': {
      const body = typeof request.body === 'string' ? request.body.trim() : ''
      if (body.length === 0) return { ok: false, code: 'empty-body', error: 'comment body required' }
      await gh(['issue', 'comment', String(number), ...target, '--body', body])
      break
    }
    case 'edit':
      await editIssue(repo.repo.slug, number, request)
      break
    case 'delete':
      await gh(['issue', 'delete', String(number), ...target, '--yes'])
      return { ok: true, action: 'delete', repo: repo.repo, number }
    default:
      return { ok: false, code: 'bad-action', error: `unsupported action ${JSON.stringify(request.action)}` }
  }
  const issue = await viewIssue(ctx, { sessionId: request.sessionId, number })
  return { ok: true, action: request.action, repo: repo.repo, issue: issue.ok ? issue.issue : null }
}

/** Apply a title and/or body edit, leaving untouched fields alone. */
async function editIssue(slug, number, request) {
  const args = ['issue', 'edit', String(number), '--repo', slug]
  const title = typeof request.title === 'string' ? request.title.trim() : ''
  const body = typeof request.body === 'string' ? request.body : ''
  if (title.length > 0) args.push('--title', title)
  if (body.length > 0) args.push('--body', body)
  if (args.length === 5) return
  await gh(args)
}

/** Create one issue and return its URL. */
async function createIssue(ctx, request) {
  const repo = await resolveRepository(ctx, request.sessionId)
  if (!repo.ok) return repo
  const title = typeof request.title === 'string' ? request.title.trim() : ''
  if (title.length === 0) return { ok: false, code: 'empty-title', error: 'issue title required' }
  const args = ['issue', 'create', '--repo', repo.repo.slug, '--title', title]
  const body = typeof request.body === 'string' ? request.body : ''
  if (body.trim().length > 0) args.push('--body', body)
  const created = await gh(args)
  const createdUrl = typeof created === 'string' && created.startsWith('http') ? created : null
  const listed = await listIssues(ctx, { sessionId: request.sessionId, state: 'open' })
  return { ok: true, url: createdUrl, repo: repo.repo, issues: listed.ok ? listed.issues : [] }
}

/** Issue key (`owner/name#42`) → the one Session working on it. */
const issueSessions = new Map()
/** Issue key → in-flight assignment, so a double click creates no second Session. */
const issueAssigns = new Map()

/** Shape one handoff response from the stored or freshly created entry. */
function handoffResult(repo, entry) {
  return {
    ok: true,
    action: 'assign',
    reused: entry.reused === true,
    sessionId: entry.sessionId,
    repo,
    number: entry.number,
    title: entry.title,
    url: entry.url,
  }
}

/**
 * Create the one Session that works on an issue, or report the live one that
 * already does. Issue work never mixes into the asking conversation, and one
 * issue never splits across two Sessions.
 */
async function assignToAgent(ctx, request) {
  const repo = await resolveRepository(ctx, request.sessionId)
  if (!repo.ok) return repo
  const number = Number(request.number)
  if (!Number.isInteger(number) || number <= 0) return { ok: false, code: 'bad-number', error: 'issue number required' }
  const key = `${repo.repo.slug}#${number}`

  const known = issueSessions.get(key)
  if (known !== undefined) {
    if (ctx.agents.get(known.sessionId) !== undefined) return handoffResult(repo.repo, { ...known, reused: true })
    issueSessions.delete(key)
  }
  const pending = issueAssigns.get(key)
  if (pending !== undefined) return pending

  const task = startIssueSession(ctx, request, repo, key, number)
  issueAssigns.set(key, task)
  try {
    return await task
  } finally {
    issueAssigns.delete(key)
  }
}

/** Fetch the issue, create its Session in the asking Session's Workspace, and send it as the first request. */
async function startIssueSession(ctx, request, repo, key, number) {
  const controller = ctx.get('sessionController')
  if (controller === undefined) {
    return { ok: false, code: 'no-session-controller', error: 'no Session creation provider' }
  }
  const directory = sessionDirectory(ctx, request.sessionId)
  const issue = await gh([
    'issue', 'view', String(number),
    '--repo', repo.repo.slug,
    '--json', VIEW_FIELDS.join(','),
  ])
  if (issue === null || typeof issue !== 'object') return { ok: false, code: 'not-found', error: `issue #${number} not found` }
  const detail = projectIssueDetail(issue)
  const text = [
    `Work on GitHub issue #${detail.number} in ${repo.repo.slug}: ${detail.title}`,
    detail.url,
    '',
    detail.body.trim().length > 0 ? detail.body.trim() : '(no description)',
    '',
    'Implement the change in this workspace, run the relevant checks, and report the result. Close the issue when it is done.',
  ].join('\n')

  // Reuse the asking Session's preset so the new one runs the same agent loop.
  const session = ctx.sessions.get(request.sessionId)
  const preset = session === undefined ? undefined : ctx.get('agentPresets')?.presetForSession(session) ?? undefined
  // Attach to the registered Workspace at this directory when there is one, so
  // the new Session joins the project's list instead of floating alone.
  const workspace = await ctx.get('workspaceRegistry')?.resolveByPath(directory)
  const sessionId = `session-${randomUUID()}`
  await controller.create({
    sessionId,
    ...(workspace === undefined ? { cwd: directory } : { workspaceId: workspace.id }),
    ...(preset === undefined ? {} : { agentPreset: preset }),
  })
  const found = await controller.resolveAgent(sessionId)
  if ('error' in found) throw found.error
  found.agent.followup({ content: [{ type: 'text', text }], source: { kind: 'user' } })
  const entry = { sessionId, number: detail.number, title: detail.title, url: detail.url, reused: false }
  issueSessions.set(key, entry)
  return handoffResult(repo.repo, entry)
}

/** Dispatch one request object; every failure keeps an explicit reason. */
async function dispatch(ctx, request) {
  try {
    switch (request.action) {
      case 'repo':
        return await listIssues(ctx, request)
      case 'list':
        return await listIssues(ctx, request)
      case 'view':
        return await viewIssue(ctx, request)
      case 'create':
        return await createIssue(ctx, request)
      case 'edit':
      case 'close':
      case 'reopen':
      case 'comment':
      case 'delete':
        return await mutateIssue(ctx, request)
      case 'assign':
        return await assignToAgent(ctx, request)
      default:
        return { ok: false, code: 'bad-action', error: `unsupported action ${JSON.stringify(request.action)}` }
    }
  } catch (error) {
    const code = typeof error?.code === 'string' && error.code.length > 0 ? error.code : 'gh-error'
    const message = error instanceof Error ? error.message : String(error)
    return { ok: false, code, error: message }
  }
}

/** Answer one authenticated request with JSON. */
async function handle(ctx, request) {
  const headers = { 'cache-control': 'no-store' }
  const url = new URL(request.url)
  const readRequest =
    request.method === 'POST'
      ? await request.text().then(text => (text.length === 0 ? {} : JSON.parse(text)))
      : { sessionId: url.searchParams.get('session') ?? '', state: url.searchParams.get('state') ?? 'open', action: url.searchParams.get('action') ?? 'list' }
  const result = await dispatch(ctx, readRequest)
  return Response.json(result, { headers })
}

/**
 * Register the GitHub route and the agent-facing tool.
 * @param {import('@deepseek-ai/cordis').Context} ctx - Host context owning both lifetimes.
 */
export function apply(ctx) {
  ctx.effect(() =>
    ctx.connection.fetch.register({
      path: ROUTE,
      methods: ['GET', 'POST'],
      requestBody: 'buffered',
      fetch: request => handle(ctx, request),
    }),
  )

  ctx.effect(() =>
    ctx.tools.register({
      name: 'github_issues',
      description:
        'Read and change the GitHub issues of the git repository containing this workspace. '
        + 'Actions: repo (repository plus open issues), list, view, create, edit, comment, close, reopen, delete, assign. '
        + 'assign starts a new Session in this workspace and hands it the issue as its first request.',
      parameters: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['repo', 'list', 'view', 'create', 'edit', 'comment', 'close', 'reopen', 'delete', 'assign'],
            description: 'Operation to perform.',
          },
          number: { type: 'integer', description: 'Issue number for view, edit, comment, close, reopen, delete, assign.' },
          title: { type: 'string', description: 'Issue title for create or edit.' },
          body: { type: 'string', description: 'Issue body for create/edit, or the comment text for comment.' },
          state: {
            type: 'string',
            enum: ['open', 'closed', 'all'],
            description: 'State filter for list; defaults to open.',
          },
          sessionId: { type: 'string', description: 'Session id when the tool is used outside the calling agent.' },
        },
        required: ['action'],
        additionalProperties: false,
      },
      output: {
        schema: { type: 'object', additionalProperties: true },
        render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
      },
      async execute(args, exec) {
        const input = args !== null && typeof args === 'object' ? { ...args } : {}
        const callingSession = exec.agent?.session?.id ?? exec.agent?.id
        if (typeof input.sessionId !== 'string' || input.sessionId.length === 0) {
          if (typeof callingSession !== 'string') {
            return { ok: false, code: 'no-session', error: 'no session id available for this call' }
          }
          input.sessionId = callingSession
        }
        return dispatch(ctx, input)
      },
    }),
  )
}
