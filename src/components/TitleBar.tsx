import { useNetworkStore } from '../store/networkStore'
import { cn } from '../lib/utils'

export default function TitleBar() {
  const { status } = useNetworkStore()

  const statusColor = {
    connected: 'bg-koon-success',
    connecting: 'bg-koon-warning animate-pulse',
    disconnected: 'bg-koon-danger',
  }[status]

  return (
    <div className="titlebar-drag flex items-center justify-between h-9 bg-koon-surface border-b border-koon-border px-4 select-none shrink-0">
      {/* Left — App name */}
      <div className="flex items-center gap-2">
        <span className="text-koon-accent font-semibold text-sm tracking-widest">KOON</span>
        <div className="flex items-center gap-1.5 ml-3">
          <div className={cn('w-1.5 h-1.5 rounded-full', statusColor)} />
          <span className="text-xs text-koon-muted capitalize">{status}</span>
        </div>
      </div>

      {/* Right — Window controls */}
      <div className="titlebar-no-drag flex items-center gap-1">
        <button
          onClick={() => window.koon.window.minimize()}
          className="w-7 h-7 flex items-center justify-center rounded text-koon-muted hover:text-koon-text hover:bg-koon-border transition-colors"
          aria-label="Minimiser"
        >
          <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
            <rect width="10" height="2" rx="1" />
          </svg>
        </button>
        <button
          onClick={() => window.koon.window.maximize()}
          className="w-7 h-7 flex items-center justify-center rounded text-koon-muted hover:text-koon-text hover:bg-koon-border transition-colors"
          aria-label="Agrandir"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="0.75" y="0.75" width="8.5" height="8.5" rx="1" />
          </svg>
        </button>
        <button
          onClick={() => window.koon.window.close()}
          className="w-7 h-7 flex items-center justify-center rounded text-koon-muted hover:text-white hover:bg-koon-danger transition-colors"
          aria-label="Fermer"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l8 8M9 1l-8 8" />
          </svg>
        </button>
      </div>
    </div>
  )
}
