"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card, CardContent } from "@/components/ui/card";

import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export function TriggerCronNode({ data, selected }: NodeProps) {
  const config = (data.config as { cronExpression?: string }) || {};

  return (
    <>
      <Card
        className={`w-48 border-2 transition-colors ${
          selected ? "border-primary" : "border-border"
        }`}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded bg-blue-500">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{data.label as string}</h4>
              <Badge
                variant="secondary"
                className="text-xs mt-1 bg-blue-100 text-blue-800"
              >
                Cron
              </Badge>
            </div>
          </div>

          <div className="text-xs space-y-1">
            <div className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
              {config.cronExpression || "*/5 * * * *"}
            </div>
            <div className="text-muted-foreground">Scheduled execution</div>
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
