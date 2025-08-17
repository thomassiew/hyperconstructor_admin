import { getWorkflows } from '@/lib/database'
import { WorkflowPreview } from '@/components/WorkflowPreview'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default async function WorkflowsPage() {
  const workflows = await getWorkflows(100)

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
        <p className="text-muted-foreground">
          {workflows.length} trading workflows
        </p>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Workflow ID
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Project ID
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Nodes
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Preview
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Executions
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Last Executed
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Created At
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {workflows.map((workflow) => (
                <tr key={workflow._id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <div className="font-mono text-sm">{workflow._id}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{workflow.name || 'Untitled'}</div>
                    {workflow.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {workflow.description}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-xs">{workflow.projectId}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {workflow.isActive ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-600/20">
                          Inactive
                        </span>
                      )}
                      {workflow.lastExecutionStatus && (
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ${
                          workflow.lastExecutionStatus === 'success'
                            ? 'bg-green-50 text-green-700 ring-green-600/20'
                            : workflow.lastExecutionStatus === 'error'
                            ? 'bg-red-50 text-red-700 ring-red-600/20'
                            : 'bg-blue-50 text-blue-700 ring-blue-600/20'
                        }`}>
                          {workflow.lastExecutionStatus}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      {workflow.nodes?.length || 0} nodes
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {workflow.edges?.length || 0} connections
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="w-40">
                      <WorkflowPreview workflow={workflow} height="100px" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium">
                      {workflow.totalExecutions.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">
                      {workflow.lastExecutedAt 
                        ? formatDate(workflow.lastExecutedAt)
                        : 'Never'
                      }
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(workflow.createdAt)}
                    </div>
                  </td>
                  <td className="p-4">
                    <a
                      href={`/workflows/${workflow._id}`}
                      className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      View Details
                    </a>
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
