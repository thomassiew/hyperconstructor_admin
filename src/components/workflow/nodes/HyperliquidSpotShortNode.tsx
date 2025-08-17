"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card, CardContent } from "@/components/ui/card";

import { TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export function HyperliquidSpotShortNode({ data, selected }: NodeProps) {
  const config =
    (data.config as {
      asset?: string;
      amount?: number;
      orderType?: string;
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
            <div className="p-1 rounded bg-red-500">
              <TrendingDown className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{data.label as string}</h4>
              <Badge
                variant="secondary"
                className="text-xs mt-1 bg-red-100 text-red-800"
              >
                Hyperliquid Spot
              </Badge>
            </div>
          </div>

          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Asset:</span>
              <span className="font-medium">{config.asset || "BTC"}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">${config.amount || 100}</span>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-medium">
                {config.orderType || "market"}
              </span>
            </div>
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
