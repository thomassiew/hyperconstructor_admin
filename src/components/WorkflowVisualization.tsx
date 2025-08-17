"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Node components
import { TriggerClickNode } from "./workflow/nodes/TriggerClickNode";
import { TriggerCronNode } from "./workflow/nodes/TriggerCronNode";
import { DiscordWebhookNode } from "./workflow/nodes/DiscordWebhookNode";
import { DelayNode } from "./workflow/nodes/DelayNode";
import { HyperliquidSpotLongNode } from "./workflow/nodes/HyperliquidSpotLongNode";
import { HyperliquidSpotShortNode } from "./workflow/nodes/HyperliquidSpotShortNode";
import { HyperliquidPerpLongNode } from "./workflow/nodes/HyperliquidPerpLongNode";
import { HyperliquidPerpShortNode } from "./workflow/nodes/HyperliquidPerpShortNode";
import { GetTokenPriceNode } from "./workflow/nodes/GetTokenPriceNode";
import { ConditionalIfNode } from "./workflow/nodes/ConditionalIfNode";
// Import workflow types
import type { Workflow } from "@/types/database";

interface WorkflowVisualizationProps {
  workflow: Workflow;
  className?: string;
  height?: string;
}

// Define node types mapping
const nodeTypes = {
  "trigger-click": TriggerClickNode,
  "trigger-cron": TriggerCronNode,
  "discord-webhook": DiscordWebhookNode,
  delay: DelayNode,
  "hyperliquid-spot-long": HyperliquidSpotLongNode,
  "hyperliquid-spot-short": HyperliquidSpotShortNode,
  "hyperliquid-perp-long": HyperliquidPerpLongNode,
  "hyperliquid-perp-short": HyperliquidPerpShortNode,
  "get-token-price": GetTokenPriceNode,
  "conditional-if": ConditionalIfNode,
};

// Transform workflow data to React Flow format
function transformWorkflowData(workflow: Workflow): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = workflow.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: {
      label: node.data.label || getDefaultNodeLabel(node.type),
      config: node.data.config || {},
      configured: true,
    },
  }));

  const edges: Edge[] = workflow.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle || undefined,
    targetHandle: edge.targetHandle || undefined,
    style: {
      strokeWidth: 2,
      stroke: "#64748b",
    },
    animated: false,
  }));

  return { nodes, edges };
}

// Get default label for node type
function getDefaultNodeLabel(nodeType: string): string {
  const labels: Record<string, string> = {
    "trigger-click": "Click Trigger",
    "trigger-cron": "Cron Trigger",
    "discord-webhook": "Discord Webhook",
    delay: "Delay",
    "hyperliquid-spot-long": "Hyperliquid Spot Long",
    "hyperliquid-spot-short": "Hyperliquid Spot Short",
    "hyperliquid-perp-long": "Hyperliquid Perp Long",
    "hyperliquid-perp-short": "Hyperliquid Perp Short",
    "get-token-price": "Get Token Price",
    "conditional-if": "Conditional If",
  };

  return labels[nodeType] || nodeType;
}

export function WorkflowVisualization({
  workflow,
  className = "",
  height = "400px",
}: WorkflowVisualizationProps) {
  const { nodes, edges } = useMemo(
    () => transformWorkflowData(workflow),
    [workflow]
  );

  return (
    <div
      className={`rounded-lg border bg-gray-50 ${className}`}
      style={{ height }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.1,
            includeHiddenNodes: false,
          }}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          minZoom={0.1}
          maxZoom={2}
          className="bg-gray-50"
        >
          <Background gap={20} size={1} color="#e2e8f0" />
          <Controls
            orientation="horizontal"
            showInteractive={false}
            showZoom={true}
            showFitView={true}
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
