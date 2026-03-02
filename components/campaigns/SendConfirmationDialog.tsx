'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Send, Calendar } from 'lucide-react'

interface SendConfirmationDialogProps {
  open: boolean
  contactCount: number
  templateName: string
  scheduledAt?: string
  onConfirm: () => void
  onCancel: () => void
}

export function SendConfirmationDialog({
  open,
  contactCount,
  templateName,
  scheduledAt,
  onConfirm,
  onCancel,
}: SendConfirmationDialogProps) {
  const isScheduled = !!scheduledAt

  const formattedDate = scheduledAt
    ? new Date(scheduledAt).toLocaleString('pt-BR', {
        dateStyle: 'long',
        timeStyle: 'short',
      })
    : null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-[420px] bg-zinc-900 border border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            {isScheduled ? 'Confirmar Agendamento' : 'Confirmar Disparo'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-amber-300 mb-2">
              Você está prestes a {isScheduled ? 'agendar' : 'enviar'}:
            </p>
            <ul className="space-y-1.5 text-sm text-gray-300">
              <li className="flex justify-between">
                <span className="text-gray-400">Template:</span>
                <span className="font-medium">{templateName}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Destinatários:</span>
                <span className="font-medium text-white">
                  {contactCount.toLocaleString('pt-BR')} contato{contactCount !== 1 ? 's' : ''}
                </span>
              </li>
              {isScheduled && (
                <li className="flex justify-between">
                  <span className="text-gray-400">Agendado para:</span>
                  <span className="font-medium">{formattedDate}</span>
                </li>
              )}
            </ul>
          </div>

          <p className="text-sm text-gray-500">
            {isScheduled
              ? 'O envio será iniciado automaticamente na data e hora agendadas.'
              : 'Esta ação não pode ser desfeita. Certifique-se de que os contatos e o template estão corretos.'}
          </p>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onCancel} className="border-white/10 hover:bg-white/5">
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              className={
                isScheduled
                  ? 'bg-purple-600 hover:bg-purple-500'
                  : 'bg-primary-600 hover:bg-primary-500'
              }
            >
              {isScheduled ? (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Agora
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Disparar Agora
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
