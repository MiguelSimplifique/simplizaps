import { Bot } from 'lucide-react'
import Link from 'next/link'

export default function BotsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Bots</h1>
          <p className="text-sm text-gray-400 mt-1">
            Crie e gerencie seus chatbots WhatsApp com flows visuais.
          </p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2
                     rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
        >
          <Bot className="h-4 w-4" />
          Novo Bot
        </button>
      </div>

      <div className="rounded-xl border border-white/5 bg-zinc-900/50 p-12 text-center">
        <Bot className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">
          Módulo de Bots em construção
        </h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          O editor visual de fluxos estará disponível em breve.
          O componente responsivo já foi implementado.
        </p>
        <Link
          href="/bots/demo"
          className="inline-flex items-center gap-2 mt-6 text-sm text-primary-400
                     hover:text-primary-300 transition-colors"
        >
          Ver demo do editor →
        </Link>
      </div>
    </div>
  )
}
