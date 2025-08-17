import { getWorkflowRuns } from '@/lib/database'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatDuration(startedAt: Date, finishedAt?: Date) {
  const end = finishedAt || new Date()
  const durationMs = end.getTime() - startedAt.getTime()
  const seconds = Math.floor(durationMs / 1000)
  
  if (seconds < 60) {
    return `${seconds}s`
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }
}

export default async function RunsPage() {
  const runs = await getWorkflowRuns(100)

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Workflow Execution Logs</h1>
        <p className="text-muted-foreground">
          {runs.length} recent workflow executions
        </p>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Run ID
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Workflow ID
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Mode
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Trigger
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Duration
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Logs
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Started At
                </th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run._id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <div className="font-mono text-sm">{run._id}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-sm">{run.workflowId}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ${
                      run.status === 'success'
                        ? 'bg-green-50 text-green-700 ring-green-600/20'
                        : run.status === 'error'
                        ? 'bg-red-50 text-red-700 ring-red-600/20'
                        : 'bg-blue-50 text-blue-700 ring-blue-600/20'
                    }`}>
                      {run.status}
                    </span>
                    {run.error && (
                      <div className="text-xs text-red-600 mt-1 max-w-xs truncate">
                        {run.error}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ${
                      run.mode === 'prod'
                        ? 'bg-purple-50 text-purple-700 ring-purple-600/20'
                        : 'bg-orange-50 text-orange-700 ring-orange-600/20'
                    }`}>
                      {run.mode}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-600/20">
                      {run.triggerSource}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      {formatDuration(run.startedAt, run.finishedAt)}
                    </div>
                    {!run.finishedAt && run.status === 'running' && (
                      <div className="text-xs text-blue-600">
                        Still running...
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      {run.logs?.length || 0} entries
                    </div>
                    {run.truncated && (
                      <div className="text-xs text-orange-600">
                        Truncated
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(run.startedAt)}
                    </div>
                    {run.finishedAt && (
                      <div className="text-xs text-muted-foreground">
                        Finished: {formatDate(run.finishedAt)}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <a
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Dashboard
        </a>
      </div>
    </div>
  )
}
