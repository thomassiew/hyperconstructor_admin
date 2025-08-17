"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card, CardContent } from "@/components/ui/card";

import { Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export function DelayNode({ data, selected }: NodeProps) {
  const config = (data.config as { delay?: number; unit?: string }) || {};

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
            <div className="p-1 rounded bg-orange-500">
              <Timer className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{data.label as string}</h4>
              <Badge
                variant="secondary"
                className="text-xs mt-1 bg-orange-100 text-orange-800"
              >
                Timer
              </Badge>
            </div>
          </div>

          <div className="text-xs space-y-1">
            <div className="font-medium">
              {config.delay || 5} {config.unit || "seconds"}
            </div>
            <div className="text-muted-foreground">Wait before next action</div>
          </div>
        </CardContent>
      </Card>

      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-primary"
      />
    </>
  );
}
