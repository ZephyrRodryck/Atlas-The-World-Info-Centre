'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { searchCountries, countries, Country } from '@/data/countries'
import { searchTopics, topics, Topic } from '@/data/topics'

type Result = { kind: 'country'; data: Country } | { kind: 'topic'; data: Topic }

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onClose() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    if (query.length > 0) {
      const countryResults: Result[] = searchCountries(query).map(c => ({ kind: 'country', data: c }))
      const topicResults: Result[] = searchTopics(query).map(t => ({ kind: 'topic', data: t }))
      // Topics first, then countries
      setResults([...topicResults, ...countryResults])
      setSelectedIndex(0)
    } else {
      setResults([])
    }
  }, [query])

  const navigate = (r: Result) => {
    if (r.kind === 'country') router.push(`/country/${r.data.code}`)
    else router.push(`/topic/${(r.data as Topic).slug}`)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && results[selectedIndex]) navigate(results[selectedIndex])
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl mx-4 bg-navy-100 border border-silver/15 rounded-xl shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-silver/10">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="text-silver/40 flex-shrink-0">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search countries, topics, events..."
            className="flex-1 bg-transparent text-silver-bright text-base outline-none placeholder:text-silver/30"
          />
          <button onClick={onClose} className="px-2 py-1 rounded bg-navy/50 border border-silver/10 text-[11px] font-mono text-silver/40 hover:text-silver/60 transition-colors">
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-silver/30 text-sm">Search countries, topics, and investigations</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Artificial Intelligence', 'Climate Change', 'India', 'Semiconductors', 'Space'].map(name => (
                  <button
                    key={name}
                    onClick={() => setQuery(name)}
                    className="px-3 py-1 rounded-full bg-navy/50 border border-silver/10 text-xs text-silver/50 hover:border-copper/30 hover:text-copper transition-all"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.length > 0 && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-silver/40 text-sm">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-silver/25 text-xs mt-1">Try a country name, topic, or domain</p>
            </div>
          )}

          {results.map((r, i) => (
            <button
              key={r.kind === 'country' ? (r.data as Country).code : (r.data as Topic).slug}
              onClick={() => navigate(r)}
              onMouseEnter={() => setSelectedIndex(i)}
              className={`w-full px-4 py-3 flex items-center gap-4 text-left transition-colors ${
                i === selectedIndex ? 'bg-copper/10' : 'hover:bg-silver/5'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-navy border border-silver/15 flex items-center justify-center flex-shrink-0">
                {r.kind === 'country' ? (
                  <span className="font-mono text-xs text-copper">{(r.data as Country).code}</span>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-copper/70">
                    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 2v2M8 12v2M2 8h2M12 8h2" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-silver-bright truncate">
                    {r.kind === 'country' ? (r.data as Country).name : (r.data as Topic).title}
                  </span>
                  <span className={`font-mono text-[9px] tracking-wider uppercase px-1.5 py-0.5 rounded border ${
                    r.kind === 'country'
                      ? 'text-silver/30 border-silver/10'
                      : 'text-copper/40 border-copper/15'
                  }`}>
                    {r.kind === 'country' ? 'Country' : (r.data as Topic).domain}
                  </span>
                </div>
                <div className="text-xs text-silver/35 mt-0.5 truncate">
                  {r.kind === 'country'
                    ? `${(r.data as Country).capital} · ${(r.data as Country).region}`
                    : (r.data as Topic).overview.slice(0, 80) + '…'
                  }
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={`text-silver/20 flex-shrink-0 ${i === selectedIndex ? 'text-copper' : ''}`}>
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
