'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

interface FlowEditorCanvasProps {
  initialNodes?: Node[]
  initialEdges?: Edge[]
  nodeTypes?: NodeTypes
  readOnly?: boolean
  onSave?: (nodes: Node[], edges: Edge[]) => void
  className?: string
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

// Mobile fallback: read-only list of nodes
function MobileFlowView({ nodes }: { nodes: Node[] }) {
  return (
    <div className="flex flex-col gap-2 p-4 overflow-y-auto h-full">
      <p className="text-xs text-gray-400 mb-2">
        Editor visual disponível em tablets e desktops.
      </p>
      {nodes.length === 0 ? (
        <p className="text-sm text-gray-500 text-center mt-8">Nenhum nó ainda.</p>
      ) : (
        nodes.map((node) => (
          <div
            key={node.id}
            className="bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-sm"
          >
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              {(node.data as { type?: string })?.type ?? node.type ?? 'node'}
            </span>
            <p className="text-white mt-0.5 font-medium">
              {(node.data as { label?: string })?.label ?? node.id}
            </p>
          </div>
        ))
      )}
    </div>
  )
}

export function FlowEditorCanvas({
  initialNodes = [],
  initialEdges = [],
  nodeTypes,
  readOnly = false,
  onSave,
  className = '',
}: FlowEditorCanvasProps) {
  const isMobile = useIsMobile()
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  if (isMobile) {
    return (
      <div className={`w-full h-full overflow-hidden bg-zinc-900 rounded-lg ${className}`}>
        <MobileFlowView nodes={nodes} />
      </div>
    )
  }

  return (
    <div
      className={`w-full h-full overflow-hidden rounded-lg ${className}`}
      style={{ minHeight: 400 }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        nodeTypes={nodeTypes}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        // Tablet-friendly: prevent accidental page scroll while panning
        preventScrolling
        className="bg-zinc-900"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="#3f3f46"
        />
        <Controls
          showInteractive={!readOnly}
          className="[&>button]:bg-zinc-800 [&>button]:border-white/10 [&>button]:text-gray-300"
        />
        <MiniMap
          nodeColor="#52525b"
          maskColor="rgba(0,0,0,0.6)"
          className="!bg-zinc-900 !border !border-white/10 !rounded-lg
                     hidden sm:block"
        />
      </ReactFlow>
      {!readOnly && onSave && (
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={() => onSave(nodes, edges)}
            className="bg-primary-600 hover:bg-primary-500 text-white text-sm
                       px-4 py-2 rounded-lg transition-colors shadow-lg"
          >
            Salvar fluxo
          </button>
        </div>
      )}
    </div>
  )
}
