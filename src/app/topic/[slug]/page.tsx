'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import ScrollRoadmap, { getCheckpointX, getCardSide } from '@/components/ScrollRoadmap'
import { topicBySlug, Topic, TopicCheckpoint } from '@/data/topics'
import { countryByCode } from '@/data/countries'

export default function TopicPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const topic = topicBySlug.get(slug)

  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const [showSummary, setShowSummary] = useState(false)

  const handleActiveChange = useCallback((i: number) => {
    setActiveIndex(i)
  }, [])

  if (!topic) {
    return (
      <div className="min-h-screen bg-navy">
        <Header />
        <div className="pt-32 text-center">
          <h1 className="font-display text-3xl text-silver-bright">Topic Not Found</h1>
          <p className="mt-4 text-silver/50">The topic &ldquo;{slug}&rdquo; was not recognized.</p>
          <Link href="/" className="mt-6 inline-block px-6 py-2 bg-copper/10 border border-copper/30 rounded-lg text-copper hover:bg-copper/20 transition-colors">
            Return to Globe
          </Link>
        </div>
      </div>
    )
  }

  const checkpoints = topic.checkpoints.map(c => ({
    id: c.id,
    title: c.title,
    short: c.short,
    period: c.period,
  }))

  // Count by period
  const periodCounts = { past: 0, present: 0, future: 0 }
  topic.checkpoints.forEach(c => periodCounts[c.period]++)

  return (
    <div className="min-h-screen bg-navy">
      <Header />

      {/* Topic header bar */}
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
              <span className="font-mono text-xs text-copper bg-copper/10 px-2 py-0.5 rounded">{topic.domain}</span>
              <h2 className="font-display text-lg font-semibold text-silver-bright">{topic.title}</h2>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setShowSummary(s => !s)}
              className={`font-mono text-[11px] tracking-wider px-3 py-1 rounded border transition-all ${
                showSummary
                  ? 'bg-copper/10 border-copper/30 text-copper'
                  : 'border-silver/15 text-silver/40 hover:border-silver/30 hover:text-silver/60'
              }`}
            >
              {showSummary ? 'Investigation View' : 'Summary'}
            </button>
            <div className="flex items-center gap-3 font-mono text-[11px] text-silver/25">
              <span>{periodCounts.past} past</span>
              <span className="text-silver/10">·</span>
              <span>{periodCounts.present} present</span>
              <span className="text-silver/10">·</span>
              <span>{periodCounts.future} future</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero section */}
      <div className="pt-[120px] pb-16 px-4 md:px-8 lg:px-16 max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-silver-bright leading-[1.1] tracking-tight">
          {topic.title}
        </h1>

        <p className="mt-6 text-[15px] md:text-base text-silver/55 leading-[1.85] max-w-2xl">
          {topic.overview}
        </p>
      </div>

      {/* Summary view */}
      {showSummary && (
        <div className="px-4 md:px-8 lg:px-16 pb-20 max-w-4xl">
          <div className="border-t border-silver/8 pt-10">
            <p className="font-mono text-[10px] text-silver/25 tracking-[0.2em] uppercase mb-8">Complete Summary</p>
            {topic.checkpoints.map((cp, i) => (
              <div key={cp.id} className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[10px] text-copper/50">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-xl font-semibold text-silver-bright">{cp.title}</h3>
                  <span className={`font-mono text-[8px] tracking-[0.2em] uppercase ${
                    cp.period === 'past' ? 'text-silver/30' : cp.period === 'present' ? 'text-copper/50' : 'text-copper/30'
                  }`}>{cp.period}</span>
                </div>
                <p className="text-[15px] text-silver/55 leading-[1.85] mb-4">{cp.summary}</p>
                <ul className="space-y-2">
                  {cp.developments.map((d, j) => (
                    <li key={j} className="flex gap-3 text-sm text-silver/45 leading-relaxed">
                      <span className="text-copper/30 mt-0.5 flex-shrink-0">—</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <ConnectedIntelligence topic={topic} />
        </div>
      )}

      {/* Scroll-driven investigation */}
      {!showSummary && (
        <>
          <div className="relative max-w-[1800px] mx-auto">
            <ScrollRoadmap
              checkpoints={checkpoints}
              activeIndex={activeIndex}
              onActiveChange={handleActiveChange}
              sectionRefs={sectionRefs}
            />

            {/* Investigation sections with temporal zone transitions */}
            {topic.checkpoints.map((cp, i) => (
              <div key={cp.id}>
                {i > 0 && cp.period !== topic.checkpoints[i - 1].period && (
                  <div className="relative py-4 px-4 md:px-16">
                    <span className="font-mono text-[9px] tracking-[0.2em] text-silver/15">
                      {cp.period === 'present' ? 'Present day' : cp.period === 'future' ? 'Looking ahead' : 'Historical'}
                    </span>
                  </div>
                )}
                <InvestigationSection
                  checkpoint={cp}
                  index={i}
                  total={topic.checkpoints.length}
                  isActive={i === activeIndex}
                  isDone={i < activeIndex}
                  ref={el => { sectionRefs.current[i] = el }}
                />
              </div>
            ))}
          </div>

          {/* Connected Intelligence (final section) */}
          <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-16">
            <ConnectedIntelligence topic={topic} />
          </div>
        </>
      )}
    </div>
  )
}

// Investigation section card positioned alongside its roadmap node
import { forwardRef } from 'react'

interface SectionProps {
  checkpoint: TopicCheckpoint
  index: number
  total: number
  isActive: boolean
  isDone: boolean
}

const InvestigationSection = forwardRef<HTMLDivElement, SectionProps>(
  function InvestigationSection({ checkpoint: cp, index, total, isActive, isDone }, ref) {
    const side = getCardSide(index)
    const xFrac = getCheckpointX(index)

    const desktopPadding = side === 'right'
      ? { paddingLeft: `${Math.min(Math.max(xFrac * 100 + 5, 20), 55)}%`, paddingRight: '4%' }
      : { paddingRight: `${Math.min(Math.max((1 - xFrac) * 100 + 5, 20), 55)}%`, paddingLeft: '4%' }

    return (
      <div
        ref={ref}
        className={`relative transition-all duration-700 ${
          isActive ? 'opacity-100 translate-y-0' : isDone ? 'opacity-60 hover:opacity-80 translate-y-0' : 'opacity-[0.15] translate-y-3'
        }`}
        style={{ minHeight: 280, paddingTop: index === 0 ? 0 : 24, paddingBottom: 48 }}
      >
        <div
          className="md:block hidden"
          style={desktopPadding}
        >
          <CardContent cp={cp} index={index} isActive={isActive} />
        </div>
        {/* Mobile: full width */}
        <div className="md:hidden px-4">
          <CardContent cp={cp} index={index} isActive={isActive} />
        </div>
      </div>
    )
  }
)

function CardContent({ cp, index, isActive }: { cp: TopicCheckpoint; index: number; isActive: boolean }) {
  return (
    <div className={`rounded-xl border backdrop-blur-sm transition-all duration-500 p-6 md:p-8
      ${isActive
        ? 'bg-navy-100/60 border-copper/15'
        : 'bg-navy-100/30 border-silver/6'
      }`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-[10px] text-copper/50">{String(index + 1).padStart(2, '0')}</span>
        <span className={`font-mono text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border
          ${cp.period === 'past'
            ? 'text-silver/35 border-silver/10 bg-silver/[0.03]'
            : cp.period === 'present'
              ? 'text-copper/50 border-copper/15 bg-copper/[0.03]'
              : 'text-copper/30 border-copper/10 bg-copper/[0.02]'
          }`}>
          {cp.period}
        </span>
      </div>

      <h3 className="font-display text-xl md:text-2xl font-semibold text-silver-bright leading-tight mb-3">
        {cp.title}
      </h3>

      <p className="text-[14px] text-silver/50 leading-[1.8] mb-5">
        {cp.summary}
      </p>

      {/* Developments */}
      <div className="space-y-3">
        {cp.developments.map((d, j) => (
          <div key={j} className="flex gap-3">
            <span className="text-copper/25 mt-0.5 flex-shrink-0 text-xs">—</span>
            <p className="text-[13px] text-silver/40 leading-relaxed">{d}</p>
          </div>
        ))}
      </div>

      {/* Entities */}
      {cp.entities.length > 0 && (
        <div className="mt-5 pt-4 border-t border-silver/5">
          <div className="flex flex-wrap gap-2">
            {cp.entities.map(e => (
              <span key={e} className="px-2.5 py-1 rounded text-[11px] font-mono text-silver/30 bg-silver/[0.03] border border-silver/6">
                {e}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ConnectedIntelligence({ topic }: { topic: Topic }) {
  const n = topic.connections.length
  const hubCx = 500
  const hubCy = 65

  const spokes = topic.connections.map((_, i) => {
    const angle = n > 1 ? -65 + (130 * i / (n - 1)) : 0
    const rad = angle * Math.PI / 180
    const len = 80 + (i % 3) * 14
    return { x: hubCx + Math.sin(rad) * len, y: hubCy + Math.cos(rad) * len }
  })

  return (
    <div className="pt-8 pb-16">
      {/* Hub and spokes */}
      <svg viewBox="0 0 1000 170" className="w-full max-h-[170px] pointer-events-none mb-10" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        {/* Entry line from route */}
        <line x1={hubCx} y1={0} x2={hubCx} y2={hubCy - 22} stroke="#9BAEC4" strokeWidth={1} opacity={0.15} />

        {/* Spokes */}
        {spokes.map((s, i) => (
          <line key={i} x1={hubCx} y1={hubCy} x2={s.x} y2={s.y}
            stroke="#9BAEC4" strokeWidth={0.7} opacity={0.12}
          />
        ))}

        {/* Hub ring */}
        <circle cx={hubCx} cy={hubCy} r={16} fill="none" stroke="#9BAEC4" strokeWidth={1} opacity={0.3} />

        {/* Hub center dot */}
        <circle cx={hubCx} cy={hubCy} r={3.5} fill="#9BAEC4" opacity={0.55} />

        {/* Spoke endpoint dots */}
        {spokes.map((s, i) => (
          <circle key={`e${i}`} cx={s.x} cy={s.y} r={2} fill="#9BAEC4" opacity={0.15} />
        ))}
      </svg>

      <div className="max-w-4xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-silver-bright mb-3">
          Connected Intelligence
        </h2>
        <p className="text-sm text-silver/40 mb-10 max-w-xl">
          Countries, organizations, and topics connected to this investigation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topic.connections.map(conn => {
            const isCountry = conn.type === 'country' && conn.code
            const isTopic = conn.type === 'topic' && conn.slug
            const href = isCountry
              ? `/country/${conn.code}`
              : isTopic
                ? `/topic/${conn.slug}`
                : undefined

            const typeColors: Record<string, string> = {
              country: 'text-copper/60 bg-copper/5 border-copper/15',
              organization: 'text-silver/50 bg-silver/[0.04] border-silver/10',
              person: 'text-silver/50 bg-silver/[0.04] border-silver/10',
              event: 'text-copper/40 bg-copper/[0.03] border-copper/10',
              topic: 'text-copper/50 bg-copper/5 border-copper/12',
            }

            const inner = (
              <div className={`group p-4 rounded-lg border transition-all ${
                href ? 'hover:border-copper/25 hover:bg-navy-50/30 cursor-pointer' : 'border-silver/6'
              } border-silver/8`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase border ${typeColors[conn.type] || ''}`}>
                    {conn.type}
                  </span>
                  {isCountry && conn.code && (
                    <span className="font-mono text-[10px] text-copper/40">{conn.code}</span>
                  )}
                </div>
                <h4 className={`text-sm font-medium mb-1 transition-colors ${
                  href ? 'text-silver/70 group-hover:text-silver-bright' : 'text-silver/60'
                }`}>{conn.name}</h4>
                <p className="text-[12px] text-silver/30 leading-relaxed">{conn.relevance}</p>
              </div>
            )

            return href ? (
              <Link key={conn.name} href={href}>{inner}</Link>
            ) : (
              <div key={conn.name}>{inner}</div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
