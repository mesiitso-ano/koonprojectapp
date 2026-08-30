import { useAdsStore } from '../../store/adsStore'

const LANGUAGES = [
  { value: '', label: 'Toutes les langues' },
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'ar', label: 'العربية' },
]

const SECTORS = [
  { value: '', label: 'Tous les secteurs' },
  { value: 'tech', label: 'Tech & Numérique' },
  { value: 'mode', label: 'Mode & Beauté' },
  { value: 'food', label: 'Alimentation' },
  { value: 'immo', label: 'Immobilier' },
  { value: 'finance', label: 'Finance' },
  { value: 'sante', label: 'Santé' },
  { value: 'education', label: 'Éducation' },
  { value: 'services', label: 'Services' },
  { value: 'autre', label: 'Autre' },
]

const SORTS = [
  { value: 'date_desc', label: 'Plus récent' },
  { value: 'date_asc', label: 'Plus ancien' },
  { value: 'popularity', label: 'Popularité' },
]

export default function AdFilters() {
  const { filters, setFilters } = useAdsStore()

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#2a2a2a] bg-[#0d0d0d] overflow-x-auto shrink-0">
      {/* Sort */}
      <select
        value={filters.sort ?? 'date_desc'}
        onChange={(e) => setFilters({ sort: e.target.value as AdSortType })}
        className="bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-[#d1d5db] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#7c3aed] cursor-pointer"
        aria-label="Trier les annonces"
      >
        {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>

      {/* Language */}
      <select
        value={filters.language ?? ''}
        onChange={(e) => setFilters({ language: e.target.value || null })}
        className="bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-[#d1d5db] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#7c3aed] cursor-pointer"
        aria-label="Filtrer par langue"
      >
        {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
      </select>

      {/* Sector */}
      <select
        value={filters.sector ?? ''}
        onChange={(e) => setFilters({ sector: e.target.value || null })}
        className="bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-[#d1d5db] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#7c3aed] cursor-pointer"
        aria-label="Filtrer par secteur"
      >
        {SECTORS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>

      {/* Saved toggle */}
      <Toggle
        active={filters.showSaved ?? false}
        label="⭐ Favoris"
        onChange={(v) => setFilters({ showSaved: v })}
      />

      {/* Followed toggle */}
      <Toggle
        active={filters.showFollowedOnly ?? false}
        label="👥 Suivis"
        onChange={(v) => setFilters({ showFollowedOnly: v })}
      />
    </div>
  )
}

function Toggle({ active, label, onChange }: { active: boolean; label: string; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!active)}
      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
        active
          ? 'bg-[#7c3aed]/20 border-[#7c3aed]/50 text-[#7c3aed]'
          : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#6b7280] hover:text-[#d1d5db]'
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  )
}
