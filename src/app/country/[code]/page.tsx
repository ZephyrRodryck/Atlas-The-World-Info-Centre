'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import InvestigationRoadmap, { RoadmapNode } from '@/components/InvestigationRoadmap'
import { countryByCode, countries, Country } from '@/data/countries'

const checkpoints: (RoadmapNode & { icon: string })[] = [
  { id: 'overview',       label: 'Overview',                 short: 'Overview',    icon: '◎' },
  { id: 'history',        label: 'Historical Developments',  short: 'History',     icon: '◈' },
  { id: 'politics',       label: 'Politics & Governance',    short: 'Governance',  icon: '⬡' },
  { id: 'economy',        label: 'Economy & Trade',          short: 'Economy',     icon: '◆' },
  { id: 'defence',        label: 'Defence & Security',       short: 'Security',    icon: '⬢' },
  { id: 'technology',     label: 'Technology & Innovation',  short: 'Technology',  icon: '◇' },
  { id: 'relations',      label: 'International Relations',  short: 'Relations',   icon: '◫' },
  { id: 'environment',    label: 'Environment & Climate',    short: 'Climate',     icon: '◉' },
  { id: 'infrastructure', label: 'Infrastructure & Society', short: 'Society',     icon: '▣' },
]

function demoContent(country: Country, id: string): { title: string; body: string[] } {
  const c = country
  const map: Record<string, { title: string; body: string[] }> = {
    overview: {
      title: `Intelligence Overview`,
      body: [
        c.overview,
        `${c.name} is located in ${c.subregion}, with its capital at ${c.capital}. The country spans approximately ${c.area} with a population of ${c.population}.`,
        `This investigation workspace provides structured analysis across political governance, economic indicators, security dynamics, technological development, and international positioning.`,
        `Navigate the roadmap above to explore specific dimensions of ${c.name}'s trajectory.`,
      ],
    },
    history: {
      title: `Historical Developments`,
      body: [
        `The historical trajectory of ${c.name} has been shaped by its geographic position in ${c.subregion} and its relationships with neighboring states and global powers.`,
        `Key historical phases include periods of formation, colonial or imperial influence, independence or modern state-building, and contemporary development. Each phase has left lasting institutional, cultural, and geopolitical imprints.`,
        `Understanding ${c.name}'s present situation requires examining how historical patterns of governance, economic structure, and international alignment have evolved over time.`,
      ],
    },
    politics: {
      title: `Politics & Governance`,
      body: [
        `${c.name}'s political landscape reflects the interplay of domestic institutions, regional dynamics, and global pressures that shape governance in ${c.subregion}.`,
        `Current governance structures, political parties, legislative processes, and civil society organizations all contribute to the country's political direction and stability.`,
        `Key political indicators include government effectiveness, rule of law, regulatory quality, and the degree of political participation and accountability.`,
      ],
    },
    economy: {
      title: `Economy & Trade`,
      body: [
        `${c.name}'s economy operates within the broader context of ${c.region}'s trade networks, global supply chains, and international financial systems.`,
        `Key economic sectors, trade relationships, fiscal policies, and development trajectories define the country's economic positioning and growth potential.`,
        `Analysis of economic indicators, trade balances, investment flows, and structural reforms provides insight into ${c.name}'s economic resilience and opportunities.`,
      ],
    },
    defence: {
      title: `Defence & Security`,
      body: [
        `${c.name}'s security environment is defined by its regional position in ${c.subregion}, alliance structures, and both conventional and non-conventional security challenges.`,
        `Military capabilities, defense spending, security partnerships, and threat assessments shape the country's defense posture and strategic calculations.`,
        `Internal security dynamics, border situations, and participation in multilateral security frameworks complete the defense picture.`,
      ],
    },
    technology: {
      title: `Technology & Innovation`,
      body: [
        `${c.name}'s technology landscape reflects its investment in research and development, digital infrastructure, and innovation ecosystems.`,
        `Key technology sectors, startup environments, digital governance initiatives, and technology transfer relationships define the country's innovation capacity.`,
        `Emerging technology adoption, AI development, cybersecurity posture, and space capabilities indicate ${c.name}'s technological trajectory.`,
      ],
    },
    relations: {
      title: `International Relations`,
      body: [
        `${c.name}'s international positioning reflects its strategic alignments, diplomatic networks, and participation in multilateral institutions.`,
        `Bilateral relationships with major powers, regional alliance structures, and positions on key international issues define the country's foreign policy orientation.`,
        `Trade diplomacy, development cooperation, and participation in international organizations complete ${c.name}'s international relations profile.`,
      ],
    },
    environment: {
      title: `Environment & Climate`,
      body: [
        `${c.name}'s environmental situation reflects the intersection of its geographic characteristics, economic development patterns, and climate vulnerability.`,
        `Key environmental indicators include carbon emissions trajectories, renewable energy adoption, biodiversity status, and climate adaptation measures.`,
        `Water security, deforestation dynamics, pollution levels, and environmental governance frameworks shape ${c.name}'s sustainability outlook.`,
      ],
    },
    infrastructure: {
      title: `Infrastructure & Society`,
      body: [
        `${c.name}'s infrastructure development reflects its urbanization patterns, connectivity goals, and social investment priorities.`,
        `Transportation networks, energy infrastructure, digital connectivity, healthcare systems, and education institutions form the foundation of societal development.`,
        `Demographic trends, urbanization rates, inequality indicators, and social cohesion dynamics provide insight into ${c.name}'s societal trajectory.`,
      ],
    },
  }
  return map[id] || map.overview
}

export default function CountryPage() {
  const params = useParams()
  const router = useRouter()
  const code = (params.code as string)?.toUpperCase()
  const country = countryByCode.get(code)
  const [activeIndex, setActiveIndex] = useState(0)
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]))

  const handleNodeSelect = useCallback((i: number) => {
    setActiveIndex(i)
    setVisited(prev => {
      const next = new Set(prev)
      next.add(i)
      return next
    })
  }, [])

  if (!country) {
    return (
      <div className="min-h-screen bg-navy">
        <Header />
        <div className="pt-32 text-center">
          <h1 className="font-display text-3xl text-silver-bright">Country Not Found</h1>
          <p className="mt-4 text-silver/50">The country code &ldquo;{code}&rdquo; was not recognized.</p>
          <Link href="/" className="mt-6 inline-block px-6 py-2 bg-copper/10 border border-copper/30 rounded-lg text-copper hover:bg-copper/20 transition-colors">
            Return to Globe
          </Link>
        </div>
      </div>
    )
  }

  const checkpoint = checkpoints[activeIndex]
  const content = demoContent(country, checkpoint.id)
  const prev = activeIndex > 0 ? checkpoints[activeIndex - 1] : null
  const next = activeIndex < checkpoints.length - 1 ? checkpoints[activeIndex + 1] : null

  return (
    <div className="min-h-screen bg-navy">
      <Header />

      {/* Country header */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-glass border-b border-silver/10">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-silver/50 hover:text-copper transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm hidden sm:inline">Back</span>
            </button>
            <span className="text-silver/15">|</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-copper bg-copper/10 px-2 py-0.5 rounded">{country.code}</span>
              <h2 className="font-display text-lg font-semibold text-silver-bright">{country.name}</h2>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 font-mono text-[11px] text-silver/30">
            <span>{country.capital}</span>
            <span className="text-silver/10">|</span>
            <span>{country.subregion}</span>
            <span className="text-silver/10">|</span>
            <span>{country.population}</span>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="pt-[120px] max-w-[1800px] mx-auto">
        {/* Roadmap section */}
        <section className="px-4 md:px-8 pt-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[10px] text-silver/25 tracking-[0.2em] uppercase">
              Investigation Roadmap
            </p>
            <p className="font-mono text-[10px] text-silver/20 tracking-wider">
              {visited.size}/{checkpoints.length} explored
            </p>
          </div>
          <InvestigationRoadmap
            nodes={checkpoints}
            activeIndex={activeIndex}
            visitedIndices={visited}
            onNodeSelect={handleNodeSelect}
          />
        </section>

        {/* Divider */}
        <div className="mx-4 md:mx-8 border-t border-silver/8" />

        {/* Content section */}
        <main className="px-4 md:px-8 lg:px-16 py-10 md:py-14 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <span className="font-mono text-[10px] text-silver/25 tracking-widest uppercase">{country.name}</span>
            <span className="text-silver/15">/</span>
            <span className="font-mono text-[10px] text-copper/50 tracking-widest uppercase">
              {checkpoint.label}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-silver-bright leading-[1.15] tracking-tight">
            {content.title}
          </h1>
          <p className="mt-4 font-mono text-[10px] text-silver/20 tracking-wider uppercase">
            Demonstration data — not live intelligence
          </p>

          {/* Body */}
          <div className="mt-10 space-y-7">
            {content.body.map((p, i) => (
              <p key={i} className="text-[15px] md:text-base text-silver/65 leading-[1.85] tracking-[0.01em]">
                {p}
              </p>
            ))}
          </div>

          {/* Focus areas (overview only) */}
          {checkpoint.id === 'overview' && (
            <div className="mt-14">
              <p className="font-mono text-[10px] text-silver/25 tracking-[0.2em] uppercase mb-5">Focus Areas</p>
              <div className="flex flex-wrap gap-2">
                {country.categories.map(cat => {
                  const idx = checkpoints.findIndex(c => c.label === cat)
                  return (
                    <button
                      key={cat}
                      onClick={() => idx >= 0 && handleNodeSelect(idx)}
                      className="px-4 py-2 rounded-lg text-xs text-silver/50 border border-silver/10
                        hover:border-copper/25 hover:text-copper transition-all"
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Prev / Next */}
          <nav className="mt-14 pt-8 border-t border-silver/8 flex items-center justify-between gap-4">
            {prev ? (
              <button
                onClick={() => handleNodeSelect(activeIndex - 1)}
                className="group flex items-center gap-3 text-left"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-silver/25 group-hover:text-copper transition-colors">
                  <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className="font-mono text-[9px] text-silver/25 tracking-widest uppercase">Previous</p>
                  <p className="text-sm text-silver/50 group-hover:text-silver/80 transition-colors">{prev.label}</p>
                </div>
              </button>
            ) : <div />}
            {next ? (
              <button
                onClick={() => handleNodeSelect(activeIndex + 1)}
                className="group flex items-center gap-3 text-right"
              >
                <div>
                  <p className="font-mono text-[9px] text-silver/25 tracking-widest uppercase">Next</p>
                  <p className="text-sm text-silver/50 group-hover:text-silver/80 transition-colors">{next.label}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-silver/25 group-hover:text-copper transition-colors">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ) : <div />}
          </nav>

          {/* Quick facts */}
          <div className="mt-14 pt-8 border-t border-silver/8">
            <p className="font-mono text-[10px] text-silver/25 tracking-[0.2em] uppercase mb-5">Quick Facts</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {[
                ['Capital', country.capital],
                ['Region', country.subregion],
                ['Population', country.population],
                ['Area', country.area],
                ['Coordinates', `${country.lat.toFixed(1)}°, ${country.lng.toFixed(1)}°`],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="font-mono text-[9px] text-silver/20 tracking-widest uppercase mb-1">{label}</p>
                  <p className={`text-sm text-silver/70 ${label === 'Coordinates' ? 'font-mono' : ''}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Connected countries */}
          <div className="mt-14 pt-8 border-t border-silver/8">
            <p className="font-mono text-[10px] text-silver/25 tracking-[0.2em] uppercase mb-5">Explore Other Countries</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {countries
                .filter(c => c.code !== country.code && c.region === country.region)
                .slice(0, 6)
                .map(c => (
                  <Link
                    key={c.code}
                    href={`/country/${c.code}`}
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-silver/[0.03] transition-colors"
                  >
                    <span className="font-mono text-xs text-copper/60 bg-copper/5 px-2 py-0.5 rounded">{c.code}</span>
                    <span className="text-sm text-silver/55 group-hover:text-silver/85 transition-colors">{c.name}</span>
                  </Link>
                ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-16 mb-8 font-mono text-[10px] text-silver/15 tracking-wider leading-relaxed">
            This workspace displays demonstration content for structural purposes.
            Live intelligence integration will be available in subsequent phases.
          </p>
        </main>
      </div>
    </div>
  )
}
