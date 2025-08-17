"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card, CardContent } from "@/components/ui/card";

import { MousePointer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
export function TriggerClickNode({ data, selected }: NodeProps) {
  return (
    <>
      <Card
        className={`w-48 border-2 transition-colors ${
          selected ? "border-primary" : "border-border"
        }`}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded bg-primary">
              <MousePointer className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{data.label as string}</h4>
              <Badge variant="secondary" className="text-xs mt-1">
                Trigger
              </Badge>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Manual execution trigger
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
