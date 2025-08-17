"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card, CardContent } from "@/components/ui/card";

import { GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export function ConditionalIfNode({ data, selected }: NodeProps) {
  const config =
    (data.config as {
      condition?: string;
    }) || {};

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-primary"
      />

      <Card
        className={`w-48 border-2 transition-colors ${
          selected ? "border-primary" : "border-border"
        }`}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded bg-indigo-500">
              <GitBranch className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{data.label as string}</h4>
              <Badge
                variant="secondary"
                className="text-xs mt-1 bg-indigo-100 text-indigo-800"
              >
                Logic
              </Badge>
            </div>
          </div>

          <div className="text-xs space-y-1">
            {config.condition && (
              <div className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                {config.condition}
              </div>
            )}
            <div className="text-muted-foreground">Conditional branching</div>
          </div>
        </CardContent>
      </Card>

      {/* True path */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="w-2 h-2 bg-green-500"
        style={{ top: "35%" }}
      />

      {/* False path */}
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="w-2 h-2 bg-red-500"
        style={{ top: "65%" }}
      />
    </>
  );
}
