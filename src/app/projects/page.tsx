import { getProjects } from '@/lib/database'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default async function ProjectsPage() {
  const projects = await getProjects(100)

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          {projects.length} user projects
        </p>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Project ID
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Description
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  User ID
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Created At
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Updated At
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <div className="font-mono text-sm">{project._id}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{project.name}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">
                      {project.description || 'No description'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-xs">{project.userId}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(project.createdAt)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(project.updatedAt)}
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
