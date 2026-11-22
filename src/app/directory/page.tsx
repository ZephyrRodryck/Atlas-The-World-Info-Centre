'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { countries, regions } from '@/data/countries'

export default function DirectoryPage() {
  const [filter, setFilter] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = countries
    if (selectedRegion) list = list.filter(c => c.region === selectedRegion)
    if (filter) {
      const q = filter.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        c.code.toLowerCase() === q
      )
    }
    return list
  }, [filter, selectedRegion])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    filtered.forEach(c => {
      const list = map.get(c.region) || []
      list.push(c)
      map.set(c.region, list)
    })
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [filtered])

  return (
    <div className="min-h-screen bg-navy">
      <Header />

      <div className="pt-24 pb-12 max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/" className="text-silver/40 hover:text-copper transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <span className="font-mono text-[10px] text-silver/30 tracking-widest uppercase">Atlas Directory</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-silver-bright">Country Directory</h1>
          <p className="mt-2 text-silver/50 text-sm max-w-xl">
            Browse all indexed countries. Select any country to open its investigation workspace.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-silver/30">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Filter countries..."
              className="w-full pl-10 pr-4 py-2.5 bg-navy-50/50 border border-silver/15 rounded-lg text-sm text-silver-bright outline-none placeholder:text-silver/30 focus:border-copper/30 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedRegion(null)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                !selectedRegion
                  ? 'bg-copper/10 border-copper/30 text-copper'
                  : 'border-silver/15 text-silver/50 hover:border-silver/30'
              }`}
            >
              All
            </button>
            {regions.map(r => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r === selectedRegion ? null : r)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                  r === selectedRegion
                    ? 'bg-copper/10 border-copper/30 text-copper'
                    : 'border-silver/15 text-silver/50 hover:border-silver/30'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="font-mono text-[11px] text-silver/30 tracking-wider mb-6">
          {filtered.length} {filtered.length === 1 ? 'COUNTRY' : 'COUNTRIES'}
        </p>

        {/* Country grid by region */}
        <div className="space-y-10">
          {grouped.map(([region, regionCountries]) => (
            <div key={region}>
              <h2 className="font-mono text-xs text-silver/40 tracking-widest uppercase mb-4 pb-2 border-b border-silver/8">
                {region} — {regionCountries.length}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {regionCountries.map(c => (
                  <Link
                    key={c.code}
                    href={`/country/${c.code}`}
                    className="group p-4 bg-navy-50/20 border border-silver/10 rounded-lg hover:border-copper/20 hover:bg-navy-50/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs text-copper/70 bg-copper/5 px-2 py-0.5 rounded mt-0.5 flex-shrink-0">
                        {c.code}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-silver/80 group-hover:text-silver-bright transition-colors truncate">
                          {c.name}
                        </h3>
                        <p className="text-xs text-silver/35 font-mono mt-0.5">{c.capital}</p>
                        <p className="text-xs text-silver/30 mt-2 line-clamp-2 leading-relaxed">{c.overview}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
