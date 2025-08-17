"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card, CardContent } from "@/components/ui/card";

import { DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export function GetTokenPriceNode({ data, selected }: NodeProps) {
  const config =
    (data.config as {
      token?: string;
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
            <div className="p-1 rounded bg-yellow-500">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{data.label as string}</h4>
              <Badge
                variant="secondary"
                className="text-xs mt-1 bg-yellow-100 text-yellow-800"
              >
                Price Data
              </Badge>
            </div>
          </div>

          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Token:</span>
              <span className="font-medium">{config.token || "BTC"}</span>
            </div>
            <div className="text-muted-foreground">Fetch current price</div>
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
