'use client'

import { FlowEditorCanvas } from '@/components/features/flows/FlowEditorCanvas'
import type { Node, Edge } from '@xyflow/react'

// Demo nodes para visualização
const DEMO_NODES: Node[] = [
  {
    id: 'start',
    type: 'input',
    position: { x: 250, y: 50 },
    data: { label: '▶ Início' },
  },
  {
    id: 'welcome',
    position: { x: 180, y: 160 },
    data: { label: '💬 Mensagem de boas-vindas' },
  },
  {
    id: 'menu',
    position: { x: 180, y: 280 },
    data: { label: '📋 Menu principal' },
  },
  {
    id: 'end',
    type: 'output',
    position: { x: 250, y: 400 },
    data: { label: '⏹ Fim' },
  },
]

const DEMO_EDGES: Edge[] = [
  { id: 'e1', source: 'start', target: 'welcome' },
  { id: 'e2', source: 'welcome', target: 'menu' },
  { id: 'e3', source: 'menu', target: 'end' },
]

export default function BotFlowPage({ params }: { params: { id: string } }) {
  const isDemo = params.id === 'demo'

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] gap-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white">
            {isDemo ? 'Demo — Flow Editor' : `Bot ${params.id}`}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Editor visual responsivo · iPad e mobile suportados
          </p>
        </div>
        {isDemo && (
          <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20
                           px-3 py-1 rounded-full">
            Demo — Story 1.6
          </span>
        )}
      </div>

      {/* Flow editor — ocupa o espaço restante */}
      <div className="relative flex-1 min-h-0">
        <FlowEditorCanvas
          initialNodes={isDemo ? DEMO_NODES : []}
          initialEdges={isDemo ? DEMO_EDGES : []}
          readOnly={isDemo}
          className="h-full"
        />
      </div>
    </div>
  )
}
