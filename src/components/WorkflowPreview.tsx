"use client";

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Node,
  Edge,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import workflow types
import type { Workflow } from '@/types/database';

interface WorkflowPreviewProps {
  workflow: Workflow;
  className?: string;
  height?: string;
}

// Simple preview - just show node count and structure without full components
function transformWorkflowForPreview(workflow: Workflow): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = workflow.nodes.map((node) => ({
    id: node.id,
    type: 'default', // Use default node type for preview
    position: node.position,
    data: {
      label: getNodeTypeIcon(node.type),
    },
    style: {
      width: 40,
      height: 40,
      fontSize: '12px',
      background: getNodeColor(node.type),
      border: '2px solid #64748b',
      borderRadius: '8px',
    },
  }));

  const edges: Edge[] = workflow.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    style: {
      strokeWidth: 1,
      stroke: '#94a3b8',
    },
    animated: false,
  }));

  return { nodes, edges };
}

// Get icon/emoji for node type
function getNodeTypeIcon(nodeType: string): string {
  const icons: Record<string, string> = {
    'trigger-click': '▶️',
    'trigger-cron': '⏰',
    'discord-webhook': '💬',
    'delay': '⏱️',
    'hyperliquid-spot-long': '📈',
    'hyperliquid-spot-short': '📉',
    'hyperliquid-perp-long': '⚡📈',
    'hyperliquid-perp-short': '⚡📉',
    'get-token-price': '💰',
    'conditional-if': '🔀',
  };
  
  return icons[nodeType] || '⚪';
}

// Get color for node type
function getNodeColor(nodeType: string): string {
  const colors: Record<string, string> = {
    'trigger-click': '#3b82f6',
    'trigger-cron': '#8b5cf6',
    'discord-webhook': '#6366f1',
    'delay': '#f97316',
    'hyperliquid-spot-long': '#10b981',
    'hyperliquid-spot-short': '#ef4444',
    'hyperliquid-perp-long': '#059669',
    'hyperliquid-perp-short': '#dc2626',
    'get-token-price': '#eab308',
    'conditional-if': '#6366f1',
  };
  
  return colors[nodeType] || '#64748b';
}

export function WorkflowPreview({ 
  workflow, 
  className = '', 
  height = '150px' 
}: WorkflowPreviewProps) {
  const { nodes, edges } = useMemo(() => transformWorkflowForPreview(workflow), [workflow]);

  if (!workflow.nodes || workflow.nodes.length === 0) {
    return (
      <div className={`rounded-lg border bg-gray-50 flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center text-muted-foreground">
          <div className="text-2xl mb-2">🔧</div>
          <div className="text-sm">No workflow configured</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border bg-gray-50 ${className}`} style={{ height }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ 
            padding: 0.2,
            includeHiddenNodes: false,
          }}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          minZoom={0.1}
          maxZoom={1}
          className="bg-gray-50"
          proOptions={{ hideAttribution: true }}
        >
          <Background 
            gap={20} 
            size={1} 
            color="#e2e8f0"
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
