/* eslint-disable @typescript-eslint/no-explicit-any */
import { getWorkflowById } from "@/lib/database";
import { WorkflowVisualization } from "@/components/WorkflowVisualization";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const resolvedParams = await params;
  const workflow = await getWorkflowById(resolvedParams.workflowId);

  if (!workflow) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Workflow not found</h1>
          <p className="text-muted-foreground mt-2">
            The workflow you&rsquo;re looking for doesn&rsquo;t exist.
          </p>
          <a
            href="/workflows"
            className="mt-4 inline-block text-primary hover:underline"
          >
            ← Back to Workflows
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <a
            href="/workflows"
            className="text-muted-foreground hover:text-foreground"
          >
            ← Workflows
          </a>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-3xl font-bold tracking-tight">
            {workflow.name || "Untitled Workflow"}
          </h1>
        </div>
      </div>

      {/* Workflow Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {workflow.isActive ? (
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
              {workflow.lastExecutionStatus && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Last run:
                  </span>
                  <Badge
                    className={
                      workflow.lastExecutionStatus === "success"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : workflow.lastExecutionStatus === "error"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }
                  >
                    {workflow.lastExecutionStatus}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Nodes:</span>
                <span className="font-semibold">
                  {workflow.nodes?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Connections:</span>
                <span className="font-semibold">
                  {workflow.edges?.length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Execution Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total runs:</span>
                <span className="font-semibold">
                  {workflow.totalExecutions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Last executed:</span>
                <span className="font-semibold text-sm">
                  {workflow.lastExecutedAt
                    ? formatDate(workflow.lastExecutedAt)
                    : "Never"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium">Project ID</div>
                <div className="font-mono text-xs text-muted-foreground">
                  {workflow.projectId}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Created</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(workflow.createdAt)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Description */}
      {workflow.description && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{workflow.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Workflow Visualization */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Workflow Diagram</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <WorkflowVisualization workflow={workflow} height="600px" />
        </CardContent>
      </Card>

      {/* Workflow Nodes Details */}
      <Card>
        <CardHeader>
          <CardTitle>Node Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          {workflow.nodes && workflow.nodes.length > 0 ? (
            <div className="space-y-4">
              {workflow.nodes.map((node: any) => (
                <div key={node.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">
                        {node.data.label || node.type}
                      </h3>
                      <Badge variant="outline" className="mt-1">
                        {node.type}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs text-muted-foreground">
                        {node.id}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Position: ({node.position.x}, {node.position.y})
                      </div>
                    </div>
                  </div>

                  {node.data.config &&
                    Object.keys(node.data.config).length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm font-medium mb-2">
                          Configuration:
                        </div>
                        <div className="bg-gray-50 rounded p-3 font-mono text-xs">
                          <pre>{JSON.stringify(node.data.config, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No nodes configured</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
