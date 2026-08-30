import { useState } from 'react'
import { useAdsStore } from '../../store/adsStore'

interface Props {
  onClose: () => void
}

const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'ar', label: 'العربية' },
]

const SECTORS = [
  'tech', 'mode', 'food', 'immo', 'finance', 'sante', 'education', 'services', 'autre'
]

export default function AdCreateForm({ onClose }: Props) {
  const { fetchAds } = useAdsStore()
  const [form, setForm] = useState({
    company_name: '',
    logo_url: '',
    description: '',
    cta_label: '',
    cta_url: '',
    language: 'fr',
    sector: 'tech',
    media_type: 'none' as AdMediaType,
    media_url: '',
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [loading, setLoading] = useState(false)

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  const validate = (): boolean => {
    const e: Partial<typeof form> = {}
    if (!form.company_name.trim()) e.company_name = 'Requis'
    if (!form.description.trim()) e.description = 'Requis'
    if (form.description.length > 500) e.description = 'Max 500 caractères'
    if (!form.cta_label.trim()) e.cta_label = 'Requis'
    if (!form.cta_url.trim()) e.cta_url = 'Requis'
    else {
      try { new URL(form.cta_url) } catch { e.cta_url = 'URL invalide' }
    }
    if (form.media_type !== 'none' && form.media_url) {
      try { new URL(form.media_url) } catch { e.media_url = 'URL invalide' }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await window.koon.ads.create({
        company_name: form.company_name,
        logo_url: form.logo_url || null,
        description: form.description,
        cta_label: form.cta_label,
        cta_url: form.cta_url,
        language: form.language,
        sector: form.sector,
        media_type: form.media_type,
        media_url: form.media_url || null,
      })
      await fetchAds()
      onClose()
    } catch (err) {
      console.error('[AdCreateForm]', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Créer une annonce"
      >
        <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a]">
          <h2 className="text-base font-semibold text-white">Créer une annonce</h2>
          <button onClick={onClose} className="text-[#6b7280] hover:text-white" aria-label="Fermer">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 1l12 12M13 1L1 13"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Field label="Nom de l'entreprise *" error={errors.company_name}>
            <input type="text" value={form.company_name} onChange={(e) => set('company_name', e.target.value)}
              className={inputCls(!!errors.company_name)} placeholder="Mon Entreprise" />
          </Field>

          <Field label="Logo URL (optionnel)">
            <input type="url" value={form.logo_url} onChange={(e) => set('logo_url', e.target.value)}
              className={inputCls(false)} placeholder="https://..." />
          </Field>

          <Field label="Description * (max 500 chars)" error={errors.description}>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              rows={3} className={inputCls(!!errors.description) + ' resize-none'} placeholder="Décrivez votre offre…" />
            <p className={`text-xs mt-1 text-right ${form.description.length > 480 ? 'text-[#f59e0b]' : 'text-[#4b5563]'}`}>
              {form.description.length}/500
            </p>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Texte du bouton CTA *" error={errors.cta_label}>
              <input type="text" value={form.cta_label} onChange={(e) => set('cta_label', e.target.value)}
                className={inputCls(!!errors.cta_label)} placeholder="Voir l'offre" />
            </Field>
            <Field label="URL du CTA *" error={errors.cta_url}>
              <input type="url" value={form.cta_url} onChange={(e) => set('cta_url', e.target.value)}
                className={inputCls(!!errors.cta_url)} placeholder="https://..." />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Langue">
              <select value={form.language} onChange={(e) => set('language', e.target.value)} className={inputCls(false)}>
                {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </Field>
            <Field label="Secteur">
              <select value={form.sector} onChange={(e) => set('sector', e.target.value)} className={inputCls(false)}>
                {SECTORS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Média">
            <div className="flex gap-3 mb-2">
              {(['none', 'image', 'video'] as AdMediaType[]).map((t) => (
                <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" value={t} checked={form.media_type === t}
                    onChange={() => set('media_type', t)} className="accent-[#7c3aed]" />
                  <span className="text-xs text-[#d1d5db]">{t === 'none' ? 'Aucun' : t === 'image' ? 'Image' : 'Vidéo (≤5min)'}</span>
                </label>
              ))}
            </div>
            {form.media_type !== 'none' && (
              <input type="url" value={form.media_url} onChange={(e) => set('media_url', e.target.value)}
                className={inputCls(!!errors.media_url)} placeholder="URL du média https://..." />
            )}
            {errors.media_url && <p className="text-xs text-red-400 mt-1">{errors.media_url}</p>}
          </Field>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#6b7280] hover:text-white transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={loading}
              className="px-5 py-2 text-sm bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Publication…' : 'Publier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-[#6b7280] mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

function inputCls(hasError: boolean) {
  return `w-full bg-[#0d0d0d] border ${hasError ? 'border-red-500' : 'border-[#2a2a2a]'} rounded-lg px-3 py-2 text-sm text-[#d1d5db] placeholder-[#4b5563] focus:outline-none focus:border-[#7c3aed]`
}
