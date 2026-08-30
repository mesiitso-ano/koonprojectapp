import { useState, useRef } from 'react'
import { useMessageStore } from '../store/messageStore'

interface Props {
  contactPubkey: string
  disabled?: boolean
}

export default function MessageInput({ contactPubkey, disabled }: Props) {
  const { sendMessage } = useMessageStore()
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = async () => {
    const trimmed = text.trim()
    if (!trimmed || sending || disabled) return

    setSending(true)
    try {
      await sendMessage(contactPubkey, trimmed)
      setText('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (err) {
      console.error('Erreur envoi:', err)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    // Auto-resize
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`
  }

  return (
    <div className="flex items-end gap-3 p-4 border-t border-koon-border bg-koon-surface">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Non connecté…' : 'Message (Entrée pour envoyer, Shift+Entrée pour ligne)'}
          disabled={disabled || sending}
          rows={1}
          className="w-full bg-koon-bg border border-koon-border rounded-xl px-4 py-2.5 text-sm text-koon-text placeholder-koon-muted focus:outline-none focus:border-koon-accent disabled:opacity-50 resize-none overflow-hidden min-h-[42px]"
          aria-label="Saisir un message"
        />
      </div>
      <button
        onClick={handleSend}
        disabled={!text.trim() || sending || disabled}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-koon-accent hover:bg-koon-accent-hover text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        aria-label="Envoyer"
      >
        {sending ? (
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeDasharray="50" strokeDashoffset="15" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        )}
      </button>
    </div>
  )
}
