/* eslint-disable @next/next/no-html-link-for-pages */
import { getAllUsersWithBasicStats } from "@/lib/userRelations";
import { AuthHeader } from "@/components/AuthHeader";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function UsersPage() {
  const usersWithStats = await getAllUsersWithBasicStats();

  return (
    <>
      <AuthHeader />
      <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          {usersWithStats.length} registered users with activity overview
        </p>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  User Info
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Wallet & Hyperliquid
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Projects
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Workflows
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Executions
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Created
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {usersWithStats.map(
                ({ user, projectCount, workflowCount, runCount }) => (
                  <tr key={user._id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {user.username || "No Username"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email || "No Email"}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">
                          ID: {user._id}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">
                          Privy: {user.privyId}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        {user.walletAddress ? (
                          <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {user.walletAddress.slice(0, 6)}...
                            {user.walletAddress.slice(-4)}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No Wallet
                          </span>
                        )}
                        <div>
                          {user.hyperliquidAccount?.exists ? (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20">
                              Hyperliquid Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-600/20">
                              No Hyperliquid
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {projectCount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          projects
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {workflowCount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          workflows
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold">{runCount}</div>
                        <div className="text-xs text-muted-foreground">
                          executions
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Updated: {formatDate(user.updatedAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      <a
                        href={`/users/${user._id}`}
                        className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        View Details
                      </a>
                    </td>
                  </tr>
                )
              )}
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
    </>
  );
}
