import { CheckCircle2, Info, X } from 'lucide-react'
import { useNotice } from '../context/NoticeContext'

export default function Toast() {
  const { notice, dismissNotice } = useNotice()

  if (!notice) return null

  const isWarning = notice.type === 'warning'

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div
        className={`pointer-events-auto flex max-w-lg items-start gap-3 rounded-2xl px-4 py-3 shadow-lg ${
          isWarning ? 'bg-amber-50 text-amber-950' : 'bg-jungle text-sand'
        }`}
        role="status"
      >
        {isWarning ? (
          <Info className="mt-0.5 h-5 w-5 shrink-0" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
        )}
        <p className="text-sm font-medium">{notice.message}</p>
        <button type="button" onClick={dismissNotice} className="ml-2 shrink-0" aria-label="Dismiss">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
