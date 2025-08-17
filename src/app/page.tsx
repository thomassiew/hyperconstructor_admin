import { getDatabaseStats } from '@/lib/database'
import { AuthHeader } from '@/components/AuthHeader'

export default async function DashboardPage() {
  const stats = await getDatabaseStats()

  return (
    <>
      <AuthHeader />
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">HyperConstructor Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your HyperConstructor database in real-time
          </p>
        </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Users Stats */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Users</h3>
            <p className="text-sm text-muted-foreground">Total registered users</p>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.users.total.toLocaleString()}</div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div>
                <div className="text-xs text-muted-foreground">With Wallet</div>
                <div className="text-sm font-medium">{stats.users.withWallet}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Hyperliquid</div>
                <div className="text-sm font-medium">{stats.users.withHyperliquid}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-muted-foreground">Active (24h)</div>
                <div className="text-sm font-medium">{stats.users.recentlyActive}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Stats */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Projects</h3>
            <p className="text-sm text-muted-foreground">User projects</p>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.projects.total.toLocaleString()}</div>
            <div className="grid grid-cols-1 gap-2 mt-4">
              <div>
                <div className="text-xs text-muted-foreground">With Workflows</div>
                <div className="text-sm font-medium">{stats.projects.withWorkflows}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Avg Workflows/Project</div>
                <div className="text-sm font-medium">{stats.projects.avgWorkflowsPerProject.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflows Stats */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Workflows</h3>
            <p className="text-sm text-muted-foreground">Trading workflows</p>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.workflows.total.toLocaleString()}</div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div>
                <div className="text-xs text-muted-foreground">Active</div>
                <div className="text-sm font-medium text-green-600">{stats.workflows.active}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Inactive</div>
                <div className="text-sm font-medium text-muted-foreground">{stats.workflows.inactive}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-muted-foreground">Avg Nodes/Workflow</div>
                <div className="text-sm font-medium">{stats.workflows.avgNodesPerWorkflow.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Runs Stats */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Executions</h3>
            <p className="text-sm text-muted-foreground">Workflow runs</p>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.runs.total.toLocaleString()}</div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div>
                <div className="text-xs text-muted-foreground">Success</div>
                <div className="text-sm font-medium text-green-600">{stats.runs.success}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Error</div>
                <div className="text-sm font-medium text-red-600">{stats.runs.error}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Running</div>
                <div className="text-sm font-medium text-blue-600">{stats.runs.running}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Last 24h</div>
                <div className="text-sm font-medium">{stats.runs.last24h}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedules Stats */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Schedules</h3>
            <p className="text-sm text-muted-foreground">Cron schedules</p>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.schedules.total.toLocaleString()}</div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div>
                <div className="text-xs text-muted-foreground">Active</div>
                <div className="text-sm font-medium text-green-600">{stats.schedules.active}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Running</div>
                <div className="text-sm font-medium text-blue-600">{stats.schedules.running}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-muted-foreground">Overdue</div>
                <div className="text-sm font-medium text-red-600">{stats.schedules.overdue}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <a
          href="/users"
          className="block rounded-lg border bg-card p-6 transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <h3 className="font-semibold">👥 Users</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Browse and manage all registered users
          </p>
        </a>
        
        <a
          href="/projects"
          className="block rounded-lg border bg-card p-6 transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <h3 className="font-semibold">📁 Projects</h3>
          <p className="text-sm text-muted-foreground mt-2">
            View user projects and their details
          </p>
        </a>
        
        <a
          href="/workflows"
          className="block rounded-lg border bg-card p-6 transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <h3 className="font-semibold">⚙️ Workflows</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Monitor workflow definitions and status
          </p>
        </a>
        
        <a
          href="/schedules"
          className="block rounded-lg border bg-card p-6 transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <h3 className="font-semibold">⏰ Schedules</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Track cron schedules and execution times
          </p>
        </a>
        
        <a
          href="/runs"
          className="block rounded-lg border bg-card p-6 transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <h3 className="font-semibold">🚀 Execution Logs</h3>
          <p className="text-sm text-muted-foreground mt-2">
            View workflow execution history and logs
          </p>
        </a>
      </div>
      </div>
    </>
  )
}
