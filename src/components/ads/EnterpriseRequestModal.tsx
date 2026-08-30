import { useState } from 'react'
import { useEnterpriseStore } from '../../store/enterpriseStore'

interface Props {
  onClose: () => void
}

export default function EnterpriseRequestModal({ onClose }: Props) {
  const { requestUpgrade } = useEnterpriseStore()
  const [form, setForm] = useState({
    company_name: '',
    logo_url: '',
    description: '',
    documents_ref: '',
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.company_name.trim()) e.company_name = 'Requis'
    if (!form.description.trim()) e.description = 'Requis'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await requestUpgrade({
        company_name: form.company_name,
        logo_url: form.logo_url || null,
        description: form.description,
        documents_ref: form.documents_ref || null,
      })
      setSubmitted(true)
    } catch (err) {
      console.error('[EnterpriseRequestModal]', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Demande compte entreprise"
      >
        <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a]">
          <h2 className="text-base font-semibold text-white">Passer en compte entreprise</h2>
          <button onClick={onClose} className="text-[#6b7280] hover:text-white" aria-label="Fermer">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 1l12 12M13 1L1 13"/>
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">⏳</div>
            <h3 className="text-base font-semibold text-white mb-2">Demande envoyée</h3>
            <p className="text-sm text-[#9ca3af]">
              Ta demande est en cours de vérification. Tu recevras une notification
              dès que ton compte sera certifié.
            </p>
            <button onClick={onClose}
              className="mt-5 px-5 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm rounded-lg transition-colors">
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <p className="text-xs text-[#9ca3af] bg-[#0d0d0d] rounded-lg p-3 border border-[#2a2a2a]">
              Fournis tes informations et justificatifs pour obtenir le badge de certification
              (numéro CFE, NIF ou tout autre document officiel).
            </p>

            <div>
              <label className="block text-xs text-[#6b7280] mb-1">Nom de l'entreprise *</label>
              <input type="text" value={form.company_name} onChange={(e) => set('company_name', e.target.value)}
                className={inputCls(!!errors.company_name)} placeholder="Mon Entreprise" />
              {errors.company_name && <p className="text-xs text-red-400 mt-1">{errors.company_name}</p>}
            </div>

            <div>
              <label className="block text-xs text-[#6b7280] mb-1">Logo URL (optionnel)</label>
              <input type="url" value={form.logo_url} onChange={(e) => set('logo_url', e.target.value)}
                className={inputCls(false)} placeholder="https://..." />
            </div>

            <div>
              <label className="block text-xs text-[#6b7280] mb-1">Description de l'activité *</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
                rows={3} className={inputCls(!!errors.description) + ' resize-none'}
                placeholder="Décris ton activité, tes produits ou services…" />
              {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-xs text-[#6b7280] mb-1">
                Référence documents (CFE, NIF, SIRET…)
              </label>
              <input type="text" value={form.documents_ref} onChange={(e) => set('documents_ref', e.target.value)}
                className={inputCls(false)} placeholder="Numéro ou lien vers les documents" />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={onClose}
                className="px-4 py-2 text-sm text-[#6b7280] hover:text-white transition-colors">
                Annuler
              </button>
              <button type="submit" disabled={loading}
                className="px-5 py-2 text-sm bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg transition-colors disabled:opacity-50">
                {loading ? 'Envoi…' : 'Soumettre la demande'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function inputCls(hasError: boolean) {
  return `w-full bg-[#0d0d0d] border ${hasError ? 'border-red-500' : 'border-[#2a2a2a]'} rounded-lg px-3 py-2 text-sm text-[#d1d5db] placeholder-[#4b5563] focus:outline-none focus:border-[#7c3aed]`
}
