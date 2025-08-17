"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card, CardContent } from "@/components/ui/card";

import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export function DiscordWebhookNode({ data, selected }: NodeProps) {
  const config =
    (data.config as { webhookUrl?: string; message?: string }) || {};

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
            <div className="p-1 rounded bg-purple-500">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{data.label as string}</h4>
              <Badge
                variant="secondary"
                className="text-xs mt-1 bg-purple-100 text-purple-800"
              >
                Discord
              </Badge>
            </div>
          </div>

          <div className="text-xs space-y-1">
            {config.message && (
              <div className="text-muted-foreground truncate">
                &ldquo;{config.message}&rdquo;
              </div>
            )}
            <div className="text-muted-foreground">Send webhook message</div>
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
