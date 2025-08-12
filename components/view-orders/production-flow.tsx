import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { getOrderItemStageStatus } from '@/actions/get-order-item-stage-status';
import { getChecklistForStage } from '@/actions/get-checklist-for-stage';
import { Checklist } from './Checklist';
import { Button } from '../ui/button';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  Position,
  Handle,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FiLock } from 'react-icons/fi';

// --- Type Definitions ---
type NodeStatus = 'pending' | 'active' | 'completed';

type NodeData = {
  label: string;
  status: NodeStatus;
};

// --- Status-based Styling ---
const statusStyles: Record<NodeStatus, React.CSSProperties> = {
  pending: {
    background: '#F3F4F6', // gray-100
    border: '1px solid #D1D5DB', // gray-300
    color: '#6B7280', // gray-500
  },
  active: {
    background: '#DBEAFE', // blue-100
    border: '1px solid #60A5FA', // blue-400
    color: '#1E40AF', // blue-800
  },
  completed: {
    background: '#D1FAE5', // green-100
    border: '1px solid #34D399', // green-400
    color: '#065F46', // green-800
  },
};

const baseNodeStyle: React.CSSProperties = {
  width: 180,
  padding: 20,
  fontSize: '18px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};

// --- Custom Node Component ---
const CustomNode = ({ data }: { data: NodeData }) => {
  const nodeStyle = useMemo(() => ({
    ...baseNodeStyle,
    ...statusStyles[data.status],
  }), [data.status]);

  return (
    <div style={nodeStyle}>
      {data.status === 'pending' && <FiLock />}
      <span>{data.label}</span>
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <Handle type="source" position={Position.Right} isConnectable={false} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const initialEdges: Edge[] = [
  { id: 'e1-4', source: '1', target: '4', type: 'smoothstep' },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },
  { id: 'e4-5', source: '4', target: '5', type: 'smoothstep' },
  { id: 'e5-6', source: '5', target: '6', type: 'smoothstep' },
];

type CheckItem = {
  check_id: number;
  name: string;
  status: 'completed' | 'pending' | 'rejected';
  notes?: string;
  inspected_by?: string;
  updated_at?: string;
};


// --- Loading Spinner ---
const Spinner = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-20">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

// --- Main Diagram Component ---
export default function Diagram({
  orderItemId,
  onNodeClick,
}: {
  orderItemId: number;
  onNodeClick: (node: Node<NodeData>) => void;
}) {
  const initialNodes: Node<NodeData>[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStages() {
      setLoading(true);
      const stages = await getOrderItemStageStatus(orderItemId);
      const nodePositions = [
        { x: 25, y: 5},
        { x: 25, y: 100 },
        { x: 250, y: 100 },
        { x: 475, y: 50 },
        { x: 700, y: 50 },
        { x: 925, y: 50 },
      ];
      const newNodes = stages.map((s, i) => ({
        id: (i + 1).toString(),
        type: 'custom',
        data: { label: s.stage, status: s.status as NodeStatus },
        position: nodePositions[i] || { x: 0, y: 0 },
        selectable: s.status !== 'pending',
        draggable: false,
      }));
      setNodes(newNodes);
      setLoading(false);
    }

    if (orderItemId) {
      fetchStages();
    }
  }, [orderItemId, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleNodeClick = (event: React.MouseEvent, node: Node<NodeData>) => {
    if (node.data.status !== 'pending') {
      onNodeClick(node);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="w-full h-full font-sans relative overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gradient-to-br from-gray-50 to-gray-100"
          proOptions={{ hideAttribution: true }}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnDoubleClick={false}
        />
      </div>
    </>
  );
}
