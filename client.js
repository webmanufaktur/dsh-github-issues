window.__ModuleLoader__.load({
  id: '@local/github-issues',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'githubIssues'
    const TAB_ID = '@local/github-issues'
    const TAB_KIND = 'github-issues'
    const ROUTE = 'api/github.issues'

    const EN = {
      tabTitle: 'GitHub',
      guideTitle: 'GitHub issues',
      guideDescription: 'Repository, remote and issues of the project.',
      openPanel: 'GitHub issues',
      issues: 'Issues',
      branch: 'branch',
      filterOpen: 'Open',
      filterClosed: 'Closed',
      filterAll: 'All',
      refresh: 'Refresh',
      refreshing: 'Refreshing…',
      newIssue: 'New issue',
      title: 'Title',
      body: 'Description',
      create: 'Create issue',
      created: 'Issue created',
      cancel: 'Cancel',
      save: 'Save',
      saved: 'Saved',
      edit: 'Edit',
      comment: 'Comment',
      sendComment: 'Send comment',
      closeIssue: 'Close issue',
      reopenIssue: 'Reopen',
      deleteIssue: 'Delete',
      deleteConfirm: 'Delete this issue permanently?',
      deleteForever: 'Delete permanently',
      deleted: 'Deleted',
      handToAgent: 'Work on this',
      handedOver: 'Opening a new session…',
      handedOverReuse: 'This issue already has its session',
      loading: 'Reading repository…',
      loadingIssue: 'Loading issue…',
      loadFailed: 'Could not read GitHub',
      issueLoadFailed: 'Could not load the issue',
      retry: 'Try again',
      noGit: 'This project is not a git repository.',
      noRemote: 'This repository has no remote.',
      notGitHub: 'This remote is not on GitHub.',
      ghMissing: 'The GitHub CLI (gh) is not installed on this machine.',
      ghError: 'The GitHub CLI failed',
      noSession: 'This panel has no Session.',
      noNewSession: 'Could not start a new session in this project.',
      empty: 'No issues here.',
      noBody: 'No description.',
      comments: 'Comments',
      noComments: 'No comments yet.',
      by: 'by',
      closed: 'Closed',
      open: 'Open',
      actionFailed: 'The action failed',
      working: 'Working…',
    }

    const DE = {
      tabTitle: 'GitHub',
      guideTitle: 'GitHub-Issues',
      guideDescription: 'Repository, Remote und Issues des Projekts.',
      openPanel: 'GitHub-Issues',
      issues: 'Issues',
      branch: 'Branch',
      filterOpen: 'Offen',
      filterClosed: 'Geschlossen',
      filterAll: 'Alle',
      refresh: 'Aktualisieren',
      refreshing: 'Wird aktualisiert…',
      newIssue: 'Neues Issue',
      title: 'Titel',
      body: 'Beschreibung',
      create: 'Issue anlegen',
      created: 'Issue angelegt',
      cancel: 'Abbrechen',
      save: 'Speichern',
      saved: 'Gespeichert',
      edit: 'Bearbeiten',
      comment: 'Kommentieren',
      sendComment: 'Kommentar senden',
      closeIssue: 'Issue schließen',
      reopenIssue: 'Wieder öffnen',
      deleteIssue: 'Löschen',
      deleteConfirm: 'Dieses Issue endgültig löschen?',
      deleteForever: 'Endgültig löschen',
      deleted: 'Gelöscht',
      handToAgent: 'Daran arbeiten',
      handedOver: 'Neue Session wird geöffnet…',
      handedOverReuse: 'Dieses Issue hat bereits seine Session',
      loading: 'Repository wird gelesen…',
      loadingIssue: 'Issue wird geladen…',
      loadFailed: 'GitHub konnte nicht gelesen werden',
      issueLoadFailed: 'Issue konnte nicht geladen werden',
      retry: 'Erneut versuchen',
      noGit: 'Dieses Projekt ist kein Git-Repository.',
      noRemote: 'Dieses Repository hat keinen Remote.',
      notGitHub: 'Dieser Remote liegt nicht auf GitHub.',
      ghMissing: 'Die GitHub-CLI (gh) ist auf diesem Rechner nicht installiert.',
      ghError: 'Die GitHub-CLI ist fehlgeschlagen',
      noSession: 'Diese Seite hat keine Session.',
      noNewSession: 'Neue Session konnte in diesem Projekt nicht gestartet werden.',
      empty: 'Keine Issues vorhanden.',
      noBody: 'Keine Beschreibung.',
      comments: 'Kommentare',
      noComments: 'Noch keine Kommentare.',
      by: 'von',
      closed: 'Geschlossen',
      open: 'Offen',
      actionFailed: 'Die Aktion ist fehlgeschlagen',
      working: 'Läuft…',
    }

    const CSS = `
.ghi-panel{display:flex;flex-direction:column;gap:10px;min-width:0;padding:12px;color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px}
.ghi-head{display:flex;align-items:flex-start;gap:8px;min-width:0}
.ghi-headText{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}
.ghi-repo{display:flex;align-items:center;gap:6px;min-width:0;font-weight:500;font-size:14px;line-height:22px}
.ghi-repoLink{color:inherit;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ghi-repoLink:hover{text-decoration:underline}
.ghi-sub{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ghi-toolbar{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.ghi-seg{display:inline-flex;gap:2px;padding:2px;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md)}
.ghi-segBtn{height:24px;padding:0 8px;border:none;border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:18px;cursor:pointer}
.ghi-segBtn:hover{background:var(--dsw-alias-interactive-bg-hover)}
.ghi-segBtn[aria-pressed="true"]{background:var(--dsw-alias-interactive-bg-hover-solid,var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-label-primary);font-weight:500}
.ghi-btn{box-sizing:border-box;height:24px;padding:0 8px;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:18px;cursor:pointer;white-space:nowrap}
.ghi-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.ghi-btn:disabled{opacity:.5;cursor:default}
.ghi-btnPrimary{border-color:transparent;background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-on-color,#fff)}
.ghi-btnPrimary:hover:not(:disabled){background:var(--dsw-alias-brand-primary);filter:brightness(1.05)}
.ghi-btnDanger{color:var(--dsw-alias-label-error)}
.ghi-btnDanger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-danger)}
.ghi-row:focus-visible,.ghi-btn:focus-visible,.ghi-segBtn:focus-visible,.ghi-input:focus-visible,.ghi-textarea:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.ghi-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:1px}
.ghi-row{display:flex;flex-direction:column;gap:4px;padding:8px;border-radius:var(--dsw-radius-md);border:.5px solid transparent;background:transparent;text-align:left;font:inherit;color:inherit;cursor:pointer;width:100%}
.ghi-row:hover{background:var(--dsw-alias-interactive-bg-hover)}
.ghi-row[data-selected="true"]{background:var(--dsw-alias-interactive-bg-hover-solid,var(--dsw-alias-bg-layer-2));border-color:var(--dsw-alias-border-l3)}
.ghi-rowTop{display:flex;align-items:baseline;gap:6px;min-width:0}
.ghi-num{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;flex:none;font-size:12px}
.ghi-rowTitle{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}
.ghi-row[data-state="closed"] .ghi-rowTitle{color:var(--dsw-alias-label-tertiary)}
.ghi-rowMeta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}
.ghi-label{display:inline-flex;align-items:center;max-width:100%;padding:0 6px;border-radius:999px;border:.5px solid var(--dsw-alias-border-l3);font-size:11px;line-height:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ghi-detail{display:flex;flex-direction:column;gap:10px;padding-top:10px;border-top:.5px solid var(--dsw-alias-border-l3)}
.ghi-detailTitle{font-size:14px;line-height:22px;font-weight:500;margin:0}
.ghi-prose{white-space:pre-wrap;overflow-wrap:anywhere;margin:0;font-size:13px;line-height:20px}
.ghi-actions{display:flex;gap:6px;flex-wrap:wrap}
.ghi-confirm{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:8px;border-radius:var(--dsw-radius-md);background:var(--dsw-alias-interactive-bg-hover-danger,var(--dsw-alias-bg-layer-2))}
.ghi-field{display:flex;flex-direction:column;gap:4px}
.ghi-fieldLabel{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.ghi-input,.ghi-textarea{box-sizing:border-box;width:100%;padding:6px 8px;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-bg-layer-2,transparent);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;resize:vertical}
.ghi-textarea{min-height:96px}
.ghi-comments{display:flex;flex-direction:column;gap:8px}
.ghi-comment{padding:8px;border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-2,rgba(127,127,127,.06))}
.ghi-commentHead{display:flex;gap:6px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;margin-bottom:4px}
.ghi-muted{color:var(--dsw-alias-label-tertiary)}
.ghi-error{color:var(--dsw-alias-label-error);font-size:12px;line-height:18px;white-space:pre-wrap}
.ghi-notice{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.ghi-empty{padding:16px 8px;text-align:center;color:var(--dsw-alias-label-tertiary)}
.ghi-stack{display:flex;flex-direction:column;gap:8px}
`

    /* The header button mirrors the shipped compact header controls: 28px, ghost until hover. */
    const BUTTON_CSS = `
.ghi-open{display:inline-flex;align-items:center;justify-content:center;flex:none;box-sizing:border-box;width:28px;height:28px;padding:0;border:none;border-radius:var(--dsw-radius-md);background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}
.ghi-open:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.ghi-open:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.ghi-open svg{width:15px;height:15px;display:block}
`

    /** Read one state of the panel over the authenticated Host route. */
    async function api(path, options) {
      const response = await fetch(ROUTE + path, {
        credentials: 'same-origin',
        ...options,
        headers: {
          accept: 'application/json',
          ...(options?.body !== undefined ? { 'content-type': 'application/json' } : {}),
          ...(options?.headers ?? {}),
        },
      })
      try {
        return await response.json()
      } catch {
        throw new Error(`${response.status} ${response.statusText}`)
      }
    }

    function post(action, body) {
      return api('', { method: 'POST', body: JSON.stringify({ action, ...body }) })
    }

    function localeTag() {
      const id = typeof navigator !== 'undefined' ? navigator.language : 'en'
      return typeof id === 'string' && id.length > 0 ? id : 'en'
    }

    /** Relative time in the user's language; dates once a week old. */
    function timeAgo(value, locale) {
      if (typeof value !== 'string') return ''
      const stamp = Date.parse(value)
      if (Number.isNaN(stamp)) return ''
      const diff = Date.now() - stamp
      const minutes = Math.max(0, Math.round(diff / 60000))
      try {
        const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'short' })
        if (minutes < 60) return relative.format(-minutes, 'minute')
        const hours = Math.round(minutes / 60)
        if (hours < 24) return relative.format(-hours, 'hour')
        const days = Math.round(hours / 24)
        if (days < 7) return relative.format(-days, 'day')
        return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short' }).format(stamp)
      } catch {
        return new Date(stamp).toISOString().slice(0, 10)
      }
    }

    function IconGitHub(props) {
      const size = props?.size ?? 16
      return h('svg', {
        viewBox: '0 0 16 16', width: size, height: size, 'aria-hidden': true, focusable: 'false',
        style: { display: 'block', flex: 'none' },
      }, h('path', {
        fill: 'currentColor',
        d: 'M8 1.2a3 3 0 0 0-1 5.84V8.3a1.7 1.7 0 0 0 1.7 1.7H10a1.2 1.2 0 0 1 1.2 1.2v.96a3 3 0 1 0 1.6 0V11.2A2.8 2.8 0 0 0 10 8.4H8.7a.1.1 0 0 1-.1-.1V7.04A3 3 0 0 0 8 1.2Zm0 1.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Zm4.8 9.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Z',
      }))
    }

    function LabelChip(props) {
      const { label } = props
      const color = /^[0-9a-f]{3,8}$/i.test(label.color) ? `#${label.color}` : undefined
      return h('span', { className: 'ghi-label', title: label.name },
        color
          ? h('span', { style: { width: 8, height: 8, borderRadius: 999, background: color, marginRight: 4, flex: 'none' }, 'aria-hidden': true })
          : null,
        label.name)
    }

    /** Turn a Host failure into one localized message. */
    function failureText(t, result) {
      if (result === null || result === undefined) return t('actionFailed')
      switch (result.code) {
        case 'no-git': return t('noGit')
        case 'no-remote': return t('noRemote')
        case 'not-github': return t('notGitHub')
        case 'gh-missing': return t('ghMissing')
        case 'no-session': return t('noSession')
        case 'no-session-controller': return t('noNewSession')
        default:
          if (typeof result.error === 'string' && result.error.trim().length > 0) {
            return `${t('actionFailed')}: ${result.error.trim()}`
          }
          return t('actionFailed')
      }
    }

    function Failure(props) {
      const { t, result, onRetry, heading } = props
      return h('div', { className: 'ghi-empty' },
        h('p', { className: 'ghi-muted', style: { margin: '0 0 8px' } },
          heading !== undefined && heading.length > 0 ? `${heading}: ${failureText(t, result)}` : failureText(t, result)),
        onRetry !== undefined
          ? h('button', { type: 'button', className: 'ghi-btn', onClick: onRetry }, t('retry'))
          : null,
      )
    }

    function IssueRow(props) {
      const { t, issue, selected, onOpen } = props
      const updated = timeAgo(issue.updatedAt, localeTag())
      return h('li', null,
        h('button', {
          type: 'button',
          className: 'ghi-row',
          'data-selected': selected ? 'true' : 'false',
          'data-state': issue.state,
          'data-issue': issue.number,
          'aria-expanded': selected ? 'true' : 'false',
          'aria-controls': `ghi-detail-${issue.number}`,
          onClick: () => onOpen(issue.number),
        },
          h('span', { className: 'ghi-rowTop' },
            h('span', { className: 'ghi-num' }, `#${issue.number}`),
            h('span', { className: 'ghi-rowTitle' }, issue.title),
          ),
          h('span', { className: 'ghi-rowMeta' },
            issue.state === 'closed' ? h('span', null, t('closed')) : null,
            issue.author !== null ? h('span', null, `${t('by')} ${issue.author}`) : null,
            updated.length > 0 ? h('span', null, updated) : null,
            ...issue.labels.slice(0, 3).map(label => h(LabelChip, { key: label.name, label })),
            issue.labels.length > 3 ? h('span', null, `+${issue.labels.length - 3}`) : null,
          ),
        ),
      )
    }

    function Editor(props) {
      const { t, initialTitle, initialBody, busy, submitLabel, onSubmit, onCancel, withTitle } = props
      const [title, setTitle] = React.useState(initialTitle ?? '')
      const [body, setBody] = React.useState(initialBody ?? '')
      const disabled = busy || (withTitle === true ? title.trim().length === 0 : body.trim().length === 0)
      return h('div', { className: 'ghi-stack' },
        withTitle === true
          ? h('label', { className: 'ghi-field' },
              h('span', { className: 'ghi-fieldLabel' }, t('title')),
              h('input', {
                className: 'ghi-input', value: title, disabled: busy,
                onChange: event => setTitle(event.target.value),
              }),
            )
          : null,
        h('label', { className: 'ghi-field' },
          h('span', { className: 'ghi-fieldLabel' }, t('body')),
          h('textarea', {
            className: 'ghi-textarea', value: body, disabled: busy,
            onChange: event => setBody(event.target.value),
          }),
        ),
        h('div', { className: 'ghi-actions' },
          h('button', {
            type: 'button', className: 'ghi-btn ghi-btnPrimary', disabled,
            onClick: () => onSubmit({ title: title.trim(), body }),
          }, busy ? t('working') : submitLabel),
          h('button', { type: 'button', className: 'ghi-btn', disabled: busy, onClick: onCancel }, t('cancel')),
        ),
      )
    }

    function IssueDetail(props) {
      const { t, sessionId, detail, onDeleted, notify, onRefresh, openSession } = props
      const issue = detail.issue
      const [mode, setMode] = React.useState('view')
      const [busy, setBusy] = React.useState(false)
      const [failure, setFailure] = React.useState(null)
      const [confirmDelete, setConfirmDelete] = React.useState(false)

      const run = async (action, body) => {
        setBusy(true)
        setFailure(null)
        try {
          const result = await post(action, { sessionId, number: issue.number, ...body })
          if (result.ok !== true) {
            setFailure(result)
            return result
          }
          return result
        } catch (error) {
          setFailure({ ok: false, error: String(error?.message ?? error) })
          return undefined
        } finally {
          setBusy(false)
        }
      }

      const finish = () => {
        setMode('view')
        onRefresh()
      }

      if (mode === 'edit') {
        return h('div', { className: 'ghi-detail', id: `ghi-detail-${issue.number}` },
          h(Editor, {
            t,
            withTitle: true,
            initialTitle: issue.title,
            initialBody: issue.body,
            busy,
            submitLabel: t('save'),
            onCancel: () => setMode('view'),
            onSubmit: async values => {
              const result = await run('edit', values)
              if (result?.ok === true) {
                notify(t('saved'))
                finish()
              }
            },
          }),
          failure !== null ? h('p', { className: 'ghi-error' }, failureText(t, failure)) : null,
        )
      }

      if (mode === 'comment') {
        return h('div', { className: 'ghi-detail', id: `ghi-detail-${issue.number}` },
          h(Editor, {
            t,
            initialBody: '',
            busy,
            submitLabel: t('sendComment'),
            onCancel: () => setMode('view'),
            onSubmit: async values => {
              const result = await run('comment', { body: values.body })
              if (result?.ok === true) {
                notify(t('saved'))
                finish()
              }
            },
          }),
          failure !== null ? h('p', { className: 'ghi-error' }, failureText(t, failure)) : null,
        )
      }

      const comments = issue.comments ?? []
      return h('div', { className: 'ghi-detail', id: `ghi-detail-${issue.number}`, 'data-issue-detail': issue.number },
        h('h3', { className: 'ghi-detailTitle' }, issue.title),
        h('div', { className: 'ghi-rowMeta' },
          h('span', null, `#${issue.number}`),
          h('span', null, issue.state === 'closed' ? t('closed') : t('open')),
          issue.author !== null ? h('span', null, `${t('by')} ${issue.author}`) : null,
          ...issue.labels.map(label => h(LabelChip, { key: label.name, label })),
        ),
        h('p', { className: 'ghi-prose' }, issue.body.trim().length > 0 ? issue.body : t('noBody')),
        h('div', { className: 'ghi-actions' },
          h('button', {
            type: 'button', className: 'ghi-btn ghi-btnPrimary', disabled: busy,
            onClick: async () => {
              const result = await run('assign', {})
              if (result?.ok === true) {
                notify(result.reused === true ? t('handedOverReuse') : t('handedOver'))
                openSession(result.sessionId)
              }
            },
          }, busy ? t('working') : t('handToAgent')),
          h('button', { type: 'button', className: 'ghi-btn', disabled: busy, onClick: () => setMode('edit') }, t('edit')),
          h('button', { type: 'button', className: 'ghi-btn', disabled: busy, onClick: () => setMode('comment') }, t('comment')),
        ),
        h('div', { className: 'ghi-actions' },
          issue.state === 'closed'
            ? h('button', {
                type: 'button', className: 'ghi-btn', disabled: busy,
                onClick: async () => { const result = await run('reopen', {}); if (result?.ok === true) finish() },
              }, t('reopenIssue'))
            : h('button', {
                type: 'button', className: 'ghi-btn', disabled: busy,
                onClick: async () => { const result = await run('close', { reason: 'completed' }); if (result?.ok === true) finish() },
              }, t('closeIssue')),
          h('button', {
            type: 'button', className: 'ghi-btn ghi-btnDanger', disabled: busy,
            onClick: () => setConfirmDelete(true),
          }, t('deleteIssue')),
        ),
        confirmDelete
          ? h('div', { className: 'ghi-confirm', role: 'group', 'aria-label': t('deleteConfirm') },
              h('span', { className: 'ghi-error' }, t('deleteConfirm')),
              h('button', {
                type: 'button', className: 'ghi-btn ghi-btnPrimary', disabled: busy,
                onClick: async () => {
                  const result = await run('delete', {})
                  if (result?.ok === true) onDeleted(issue.number)
                  else setConfirmDelete(false)
                },
              }, busy ? t('working') : t('deleteForever')),
              h('button', {
                type: 'button', className: 'ghi-btn', disabled: busy,
                onClick: () => setConfirmDelete(false),
              }, t('cancel')),
            )
          : null,
        failure !== null ? h('p', { className: 'ghi-error' }, failureText(t, failure)) : null,
        h('div', null,
          h('div', { className: 'ghi-fieldLabel' }, `${t('comments')} (${comments.length})`),
          comments.length === 0
            ? h('p', { className: 'ghi-muted', style: { margin: '6px 0 0' } }, t('noComments'))
            : h('div', { className: 'ghi-comments', style: { marginTop: 6 } }, comments.map((comment, index) => h('div', {
                key: `${comment.createdAt ?? ''}-${index}`, className: 'ghi-comment',
              },
                h('div', { className: 'ghi-commentHead' },
                  h('span', null, comment.author ?? ''),
                  h('span', null, timeAgo(comment.createdAt, localeTag())),
                ),
                h('p', { className: 'ghi-prose' }, comment.body),
              ))),
        ),
      )
    }

    function GithubIssuesPanel(props) {
      const { t, sessionId, openSession } = props
      const [state, setState] = React.useState({ status: 'loading', payload: null, error: null })
      const [filter, setFilter] = React.useState('open')
      const [selected, setSelected] = React.useState(null)
      const [detail, setDetail] = React.useState({ status: 'idle', payload: null })
      const [creating, setCreating] = React.useState(false)
      const [creatingBusy, setCreatingBusy] = React.useState(false)
      const [creatingFailure, setCreatingFailure] = React.useState(null)
      const [notice, setNotice] = React.useState(null)
      const [busy, setBusy] = React.useState(false)

      const load = React.useCallback(async (nextFilter, signal) => {
        setState(current => ({ status: current.payload === null ? 'loading' : current.status, payload: current.payload, error: null }))
        setBusy(true)
        try {
          const query = `?session=${encodeURIComponent(sessionId ?? '')}&state=${encodeURIComponent(nextFilter)}`
          const payload = await api(query, { signal })
          setState({ status: 'ready', payload, error: null })
        } catch (error) {
          if (error?.name === 'AbortError') return
          setState({ status: 'error', payload: null, error: String(error?.message ?? error) })
        } finally {
          setBusy(false)
        }
      }, [sessionId])

      React.useEffect(() => {
        if (typeof sessionId !== 'string' || sessionId.length === 0) {
          setState({ status: 'error', payload: null, error: null })
          return undefined
        }
        const controller = new AbortController()
        load(filter, controller.signal)
        return () => controller.abort()
      }, [filter, load, sessionId])

      const loadIssue = React.useCallback(async number => {
        setDetail({ status: 'loading', payload: null })
        try {
          const payload = await post('view', { sessionId, number })
          setDetail(payload.ok === true ? { status: 'ready', payload } : { status: 'error', payload })
        } catch (error) {
          setDetail({ status: 'error', payload: { ok: false, error: String(error?.message ?? error) } })
        }
      }, [sessionId])

      const openIssue = React.useCallback(number => {
        if (selected === number) {
          setSelected(null)
          setDetail({ status: 'idle', payload: null })
          return
        }
        setSelected(number)
        loadIssue(number)
      }, [loadIssue, selected])

      const reload = React.useCallback(() => {
        load(filter, undefined)
        if (selected !== null) loadIssue(selected)
      }, [filter, load, loadIssue, selected])

      const notify = React.useCallback(message => {
        setNotice(message)
        setTimeout(() => setNotice(null), 4000)
      }, [])

      if (typeof sessionId !== 'string' || sessionId.length === 0) {
        return h('div', { className: 'ghi-panel' }, h('style', null, CSS), h('p', { className: 'ghi-muted' }, t('noSession')))
      }
      if (state.status === 'loading' && state.payload === null) {
        return h('div', { className: 'ghi-panel' }, h('style', null, CSS), h('p', { className: 'ghi-muted' }, t('loading')))
      }
      if (state.status === 'error' && state.payload === null) {
        return h('div', { className: 'ghi-panel' },
          h('style', null, CSS),
          h('p', { className: 'ghi-error' }, `${t('loadFailed')}: ${state.error ?? ''}`),
          h('div', null, h('button', { type: 'button', className: 'ghi-btn', onClick: reload }, t('retry'))),
        )
      }

      const payload = state.payload
      if (payload === null || payload.ok !== true) {
        return h('div', { className: 'ghi-panel' },
          h('style', null, CSS),
          h('div', { className: 'ghi-head' },
            h(IconGitHub, { size: 18 }),
            h('div', { className: 'ghi-headText' }, h('span', { className: 'ghi-repo' }, t('issues'))),
          ),
          h(Failure, { t, result: payload, onRetry: reload }),
        )
      }

      const repo = payload.repo
      const issues = Array.isArray(payload.issues) ? payload.issues : []
      const selectedIssue = detail.status === 'ready' && detail.payload?.ok === true && detail.payload.issue.number === selected
        ? detail.payload
        : null

      return h('div', { className: 'ghi-panel', 'data-github-issues': 'true' },
        h('style', null, CSS),
        h('div', { className: 'ghi-head' },
          h(IconGitHub, { size: 18 }),
          h('div', { className: 'ghi-headText' },
            h('span', { className: 'ghi-repo' },
              h('a', {
                className: 'ghi-repoLink',
                href: repo.url,
                target: '_blank',
                rel: 'noreferrer',
                title: repo.url,
              }, `${repo.owner}/${repo.name}`)),
            h('span', { className: 'ghi-sub', title: repo.root },
              [repo.branch !== null && repo.branch !== '' ? repo.branch : null, repo.root]
                .filter(value => typeof value === 'string' && value.length > 0)
                .join(' · ')),
          ),
        ),
        h('div', { className: 'ghi-toolbar' },
          h('div', { className: 'ghi-seg', role: 'group', 'aria-label': t('issues') },
            [['open', t('filterOpen')], ['closed', t('filterClosed')], ['all', t('filterAll')]].map(([value, label]) =>
              h('button', {
                key: value, type: 'button', className: 'ghi-segBtn',
                'aria-pressed': filter === value ? 'true' : 'false',
                onClick: () => setFilter(value),
              }, label))),
          h('button', { type: 'button', className: 'ghi-btn', disabled: busy, onClick: reload }, busy ? t('refreshing') : t('refresh')),
          h('button', {
            type: 'button', className: 'ghi-btn ghi-btnPrimary',
            onClick: () => { setCreating(value => !value); setCreatingFailure(null) },
          }, t('newIssue')),
        ),
        notice !== null ? h('p', { className: 'ghi-notice', role: 'status' }, notice) : null,
        creating
          ? h('div', { className: 'ghi-stack', 'data-issue-create': 'true' },
              h(Editor, {
                t, withTitle: true, busy: creatingBusy,
                submitLabel: t('create'),
                onCancel: () => { setCreating(false); setCreatingFailure(null) },
                onSubmit: async values => {
                  setCreatingBusy(true)
                  setCreatingFailure(null)
                  try {
                    const result = await post('create', { sessionId, ...values })
                    if (result.ok === true) {
                      setCreating(false)
                      notify(t('created'))
                      reload()
                    } else {
                      setCreatingFailure(result)
                    }
                  } catch (error) {
                    setCreatingFailure({ ok: false, error: String(error?.message ?? error) })
                  } finally {
                    setCreatingBusy(false)
                  }
                },
              }),
              creatingFailure !== null
                ? h('p', { className: 'ghi-error' }, failureText(t, creatingFailure))
                : null,
            )
          : null,
        issues.length === 0
          ? h('p', { className: 'ghi-empty' }, t('empty'))
          : h('ul', { className: 'ghi-list' }, issues.map(issue => h(React.Fragment, { key: issue.number },
              h(IssueRow, { t, issue, selected: issue.number === selected, onOpen: openIssue }),
              issue.number === selected
                ? h('li', null,
                    detail.status === 'loading'
                      ? h('p', { className: 'ghi-muted', style: { padding: '8px' } }, t('loadingIssue'))
                      : detail.status === 'error'
                        ? h(Failure, {
                            t,
                            result: detail.payload,
                            heading: t('issueLoadFailed'),
                            onRetry: () => loadIssue(issue.number),
                          })
                        : selectedIssue !== null
                          ? h(IssueDetail, {
                              t,
                              sessionId,
                              detail: selectedIssue,
                              notify,
                              openSession: props.openSession,
                              onRefresh: reload,
                              onDeleted: number => {
                                setSelected(null)
                                setDetail({ status: 'idle', payload: null })
                                notify(`${t('deleted')} #${number}`)
                                reload()
                              },
                            })
                          : null,
                  )
                : null,
            ))),
      )
    }

    /** The compact glyph the guide card draws before the title. */
    function GuideGlyph(props) {
      return h(IconGitHub, { size: props?.size ?? 16 })
    }

    /** The issue-and-branch glyph the header button draws. */
    function IconBranch() {
      return h('svg', { viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('g', {
          fill: 'none', stroke: 'currentColor', strokeWidth: 1.5,
          strokeLinecap: 'round', strokeLinejoin: 'round',
        },
          h('circle', { cx: 4.6, cy: 3.4, r: 1.7 }),
          h('circle', { cx: 4.6, cy: 12.6, r: 1.7 }),
          h('circle', { cx: 11.4, cy: 8, r: 1.7 }),
          h('path', { d: 'M4.6 5.1v5.8' }),
          h('path', { d: 'M6.3 3.4h2.9a2.2 2.2 0 0 1 2.2 2.2v.7' }),
          h('path', { d: 'M11.4 9.7v.7a2.2 2.2 0 0 1-2.2 2.2H6.3' }),
        ))
    }

    /** One header utility that opens the page directly, beside the right-sidebar toggle. */
    function HeaderOpenButton(props) {
      const { t, onOpen } = props
      return h(React.Fragment, null,
        h('style', null, BUTTON_CSS),
        h('button', {
          type: 'button',
          className: 'ghi-open',
          'aria-label': t('openPanel'),
          title: t('openPanel'),
          'data-github-issues-open': 'true',
          onClick: onOpen,
        }, IconBranch()),
      )
    }

    return {
      inject: ['slots', 'locale', 'sidebarRight', 'sidebarRightTabs', 'uiWorkspace'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { en: EN, de: DE }), 'github-issues: dictionaries')
        const t = ctx.locale.bind(NS)

        ctx.effect(() => ctx.sidebarRightTabs.register({
          id: TAB_ID,
          kind: TAB_KIND,
          title: () => t('tabTitle'),
          keepMounted: true,
          guide: [{
            id: 'github-issues',
            order: 35,
            title: () => t('guideTitle'),
            description: () => t('guideDescription'),
            icon: GuideGlyph,
          }],
        }), 'github-issues: tab type')

        ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
          name: 'conversation.session.header.utilities',
          id: 'github-issues.open',
          order: 40,
          locale: NS,
          label: () => t('openPanel'),
        }, () => h(HeaderOpenButton, {
          t,
          onOpen: () => {
            try {
              ctx.sidebarRight.openTab(TAB_KIND)
            } catch (error) {
              console.error('github-issues: could not open the panel', error)
            }
          },
        })))

        ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
          name: 'sidebar.right.pane.tab',
          key: TAB_ID,
          locale: NS,
          inject: sessionId => ({ sessionId }),
        }, props => h(GithubIssuesPanel, {
          t,
          sessionId: props.sessionId,
          openSession: id => {
            try {
              ctx.uiWorkspace.openSession(id)
            } catch (error) {
              console.error('github-issues: could not open the new session', error)
            }
          },
        })))
      },
    }
  },
})
