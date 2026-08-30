import { useState, useEffect } from 'react'
import { shortPubkey } from '../../lib/utils'

interface Props {
  adId: string
}

export default function AdComments({ adId }: Props) {
  const [comments, setComments] = useState<AdComment[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const LIMIT = 10

  const loadComments = async (reset = false) => {
    const newOffset = reset ? 0 : offset
    setLoading(true)
    try {
      const batch = await window.koon.ads.getComments(adId, LIMIT, newOffset)
      setComments((prev) => reset ? batch : [...prev, ...batch])
      setOffset(newOffset + batch.length)
      setHasMore(batch.length === LIMIT)
    } catch (e) {
      console.error('[AdComments] load error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComments(true)
  }, [adId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = text.trim()
    if (!content || sending) return
    setSending(true)
    try {
      const comment = await window.koon.ads.comment({ ad_id: adId, content })
      // Optimistic prepend
      setComments((prev) => [comment, ...prev])
      setText('')
    } catch (err) {
      console.error('[AdComments] send error:', err)
    } finally {
      setSending(false)
    }
  }

  const remaining = 300 - text.length

  return (
    <div className="mt-4">
      <h4 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3">
        Commentaires
      </h4>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 300))}
            placeholder="Écrire un commentaire…"
            className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#d1d5db] placeholder-[#4b5563] focus:outline-none focus:border-[#7c3aed]"
            aria-label="Saisir un commentaire"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="px-3 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs rounded-lg transition-colors disabled:opacity-40"
            aria-label="Envoyer le commentaire"
          >
            {sending ? '…' : 'Envoyer'}
          </button>
        </div>
        {text.length > 250 && (
          <p className={`text-xs mt-1 ${remaining < 0 ? 'text-red-400' : 'text-[#6b7280]'}`}>
            {remaining} caractères restants
          </p>
        )}
      </form>

      {/* List */}
      <div className="space-y-3">
        {loading && comments.length === 0 ? (
          <p className="text-xs text-[#4b5563] text-center py-4">Chargement…</p>
        ) : comments.length === 0 ? (
          <p className="text-xs text-[#4b5563] text-center py-4">Aucun commentaire. Sois le premier !</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[10px] text-[#7c3aed] font-bold shrink-0">
                {c.author_pubkey.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 bg-[#0d0d0d] rounded-lg px-3 py-2">
                <p className="text-[10px] text-[#7c3aed] font-mono mb-1">{shortPubkey(c.author_pubkey)}</p>
                <p className="text-sm text-[#d1d5db] break-words">{c.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {hasMore && !loading && (
        <button
          onClick={() => loadComments(false)}
          className="w-full mt-3 text-xs text-[#6b7280] hover:text-[#7c3aed] transition-colors py-2"
        >
          Charger plus de commentaires
        </button>
      )}
    </div>
  )
}
