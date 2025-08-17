import { getWorkflowSchedules } from '@/lib/database'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default async function SchedulesPage() {
  const schedules = await getWorkflowSchedules(100)

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Workflow Schedules</h1>
        <p className="text-muted-foreground">
          {schedules.length} cron schedules
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
                  Cron Expression
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Next Run
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Last Evaluated
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  User ID
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule._id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <div className="font-mono text-sm">{schedule.workflowId}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {schedule.cronExpression}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {schedule.isActive ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-600/20">
                          Inactive
                        </span>
                      )}
                      {schedule.running && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-600/20">
                          Running
                        </span>
                      )}
                      {schedule.nextRunAt < new Date() && schedule.isActive && !schedule.running && (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/20">
                          Overdue
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`text-sm ${
                      schedule.nextRunAt < new Date() && schedule.isActive && !schedule.running
                        ? 'text-red-600 font-medium'
                        : 'text-muted-foreground'
                    }`}>
                      {formatDate(schedule.nextRunAt)}
                    </div>
                    {schedule.runningSince && (
                      <div className="text-xs text-blue-600 mt-1">
                        Running since {formatDate(schedule.runningSince)}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">
                      {schedule.lastEvaluatedAt 
                        ? formatDate(schedule.lastEvaluatedAt)
                        : 'Never'
                      }
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-xs">{schedule.userId}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(schedule.createdAt)}
                    </div>
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
