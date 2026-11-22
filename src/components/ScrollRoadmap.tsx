'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'

export interface ScrollCheckpoint {
  id: string
  title: string
  short: string
  period: 'past' | 'present' | 'future'
}

interface Props {
  checkpoints: ScrollCheckpoint[]
  activeIndex: number
  onActiveChange: (index: number) => void
  sectionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
}

// Wide, organic X positions (0–1). Covers ~12%–88% of viewport.
const X_PATTERN = [0.15, 0.58, 0.82, 0.25, 0.68, 0.12, 0.75, 0.35, 0.88, 0.22, 0.62, 0.42]
const X_PATTERN_MOBILE = [0.25, 0.72, 0.30, 0.68, 0.22, 0.75, 0.35, 0.65, 0.28, 0.70, 0.32, 0.62]

export function getCheckpointX(i: number): number {
  return X_PATTERN[i % X_PATTERN.length]
}

export function getCardSide(i: number): 'left' | 'right' {
  return getCheckpointX(i) > 0.5 ? 'left' : 'right'
}

const PERIOD_COLORS: Record<string, string> = {
  past: '#B8956A',
  present: '#E8743B',
  future: '#9BAEC4',
}

function curveBetween(x1: number, y1: number, x2: number, y2: number): string {
  const dy = y2 - y1
  return `C${x1},${y1 + dy * 0.42} ${x2},${y2 - dy * 0.42} ${x2},${y2}`
}

export default function ScrollRoadmap({ checkpoints, activeIndex, onActiveChange, sectionRefs }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<SVGPathElement>(null)
  const dotGroupRef = useRef<SVGGElement>(null)
  const dotFillRef = useRef<SVGCircleElement>(null)
  const dotGlowRef = useRef<SVGCircleElement>(null)
  const [dims, setDims] = useState({ w: 1200, h: 2000 })
  const [nodeYs, setNodeYs] = useState<number[]>([])

  // Measure container
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      if (width > 0) setDims({ w: width, h: height })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Measure section tops → node Y positions
  const measure = useCallback(() => {
    const c = containerRef.current
    if (!c) return
    const cTop = c.getBoundingClientRect().top + window.scrollY
    const ys: number[] = []
    sectionRefs.current.forEach((el, i) => {
      if (el) {
        const r = el.getBoundingClientRect()
        ys[i] = r.top + window.scrollY - cTop + 40
      }
    })
    setNodeYs(ys)
    setDims(d => ({ ...d, h: c.scrollHeight }))
  }, [sectionRefs])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    const timer = setTimeout(measure, 200)
    return () => { window.removeEventListener('resize', measure); clearTimeout(timer) }
  }, [measure, checkpoints.length])

  useEffect(() => { const t = setTimeout(measure, 50); return () => clearTimeout(t) }, [measure, activeIndex])

  const isMobile = dims.w < 768

  // Node pixel positions
  const nodes = useMemo(() =>
    checkpoints.map((_, i) => {
      const pattern = isMobile ? X_PATTERN_MOBILE : X_PATTERN
      const xFrac = pattern[i % pattern.length]
      const pad = isMobile ? 24 : 48
      return {
        x: pad + xFrac * (dims.w - pad * 2),
        y: nodeYs[i] ?? (i + 1) * 400,
      }
    }),
    [checkpoints.length, dims.w, nodeYs, isMobile]
  )

  // SVG path
  const pathD = useMemo(() => {
    if (nodes.length < 2) return ''
    let d = `M${nodes[0].x},${nodes[0].y}`
    for (let i = 1; i < nodes.length; i++) {
      d += ' ' + curveBetween(nodes[i - 1].x, nodes[i - 1].y, nodes[i].x, nodes[i].y)
    }
    return d
  }, [nodes])

  // Temporal gradient stops from checkpoint periods
  const gradientStops = useMemo(() => {
    if (nodes.length < 2 || dims.h < 1) return []
    return checkpoints.map((cp, i) => ({
      offset: nodes[i] ? nodes[i].y / dims.h : i / checkpoints.length,
      color: PERIOD_COLORS[cp.period],
    }))
  }, [checkpoints, nodes, dims.h])

  // Contour ellipses around checkpoints
  const contours = useMemo(() =>
    nodes.flatMap((n, i) =>
      [1.4, 2.2, 3.2].map((scale, j) => ({
        cx: n.x,
        cy: n.y,
        rx: 45 * scale + (i % 3) * 12,
        ry: 32 * scale + (i % 2) * 10,
        rotation: (i * 27 + j * 18) % 360,
        opacity: 0.022 - j * 0.005,
      }))
    ),
    [nodes]
  )

  // Open arc contours — partial curves for a more natural topo feel
  const topoArcs = useMemo(() =>
    nodes.flatMap((n, i) =>
      [0, 1, 2].map(j => {
        const r = 65 + j * 40 + (i % 3) * 15
        const ry = r * (0.7 + (i % 2) * 0.2)
        const startAngle = ((i * 47 + j * 73) % 360) * Math.PI / 180
        const sweep = (70 + (i % 3) * 30) * Math.PI / 180
        const x1 = n.x + r * Math.cos(startAngle)
        const y1 = n.y + ry * Math.sin(startAngle)
        const x2 = n.x + r * Math.cos(startAngle + sweep)
        const y2 = n.y + ry * Math.sin(startAngle + sweep)
        return {
          d: `M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${ry} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)}`,
          opacity: 0.018 - j * 0.004,
        }
      })
    ),
    [nodes]
  )

  // Subtle horizontal grid lines (cartographic latitude)
  const gridLines = useMemo(() => {
    if (dims.h < 400) return []
    const lines: number[] = []
    for (let y = 240; y < dims.h - 100; y += 220) lines.push(y)
    return lines
  }, [dims.h])

  // Scroll-driven illumination, dot position, active detection — all via direct DOM updates
  useEffect(() => {
    let lastActive = -1

    const onScroll = () => {
      const c = containerRef.current
      const p = pathRef.current
      const g = glowRef.current
      const dotGroup = dotGroupRef.current
      const dotFill = dotFillRef.current
      const dotGlow = dotGlowRef.current
      if (!c || !p) return

      const rect = c.getBoundingClientRect()
      const vh = window.innerHeight
      const start = rect.top
      const end = rect.bottom - vh
      const range = end - start
      const progress = range > 0 ? Math.max(0, Math.min(1, -start / range)) : 0

      // Drive stroke illumination
      const len = p.getTotalLength()
      if (len) {
        const drawn = len * progress
        p.style.strokeDasharray = `${drawn} ${len}`
        p.style.strokeDashoffset = '0'
        if (g) {
          g.style.strokeDasharray = `${drawn} ${len}`
          g.style.strokeDashoffset = '0'
        }

        // Position traveling dot
        if (dotGroup && progress > 0.01) {
          const point = p.getPointAtLength(drawn)
          dotGroup.setAttribute('transform', `translate(${point.x}, ${point.y})`)
          dotGroup.style.opacity = '1'
        } else if (dotGroup) {
          dotGroup.style.opacity = '0'
        }
      }

      // Active section: closest section top to 35% viewport
      const target = vh * 0.35
      let best = 0
      let bestDist = Infinity
      sectionRefs.current.forEach((el, i) => {
        if (el) {
          const dist = Math.abs(el.getBoundingClientRect().top - target)
          if (dist < bestDist) { bestDist = dist; best = i }
        }
      })

      if (best !== lastActive) {
        lastActive = best
        onActiveChange(best)
        // Update dot color to match the active era
        const color = PERIOD_COLORS[checkpoints[best]?.period ?? 'present']
        if (dotFill) dotFill.setAttribute('fill', color)
        if (dotGlow) dotGlow.setAttribute('fill', color)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [onActiveChange, sectionRefs, checkpoints])

  // Click-to-scroll
  const scrollToCheckpoint = useCallback((i: number) => {
    const el = sectionRefs.current[i]
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [sectionRefs])

  return (
    <div ref={containerRef} className="relative w-full">
      {/* SVG route layer */}
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: dims.h }}
        aria-hidden="true"
      >
        <defs>
          <filter id="sr-glow-soft"><feGaussianBlur in="SourceGraphic" stdDeviation="8" /></filter>
          <filter id="sr-dot-glow"><feGaussianBlur in="SourceGraphic" stdDeviation="6" /></filter>
          <linearGradient id="sr-temporal" x1="0" y1="0" x2="0" y2="1">
            {gradientStops.map((s, i) => (
              <stop key={i} offset={`${(s.offset * 100).toFixed(1)}%`} stopColor={s.color} />
            ))}
          </linearGradient>
          <linearGradient id="sr-temporal-glow" x1="0" y1="0" x2="0" y2="1">
            {gradientStops.map((s, i) => (
              <stop key={i} offset={`${(s.offset * 100).toFixed(1)}%`} stopColor={s.color} stopOpacity={0.15} />
            ))}
          </linearGradient>
          {/* Ambient radial glows — era-colored regions behind each checkpoint */}
          <radialGradient id="sr-amb-past" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8FA3C7" stopOpacity={0.04} />
            <stop offset="70%" stopColor="#8FA3C7" stopOpacity={0.01} />
            <stop offset="100%" stopColor="#8FA3C7" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="sr-amb-present" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8743B" stopOpacity={0.035} />
            <stop offset="70%" stopColor="#E8743B" stopOpacity={0.008} />
            <stop offset="100%" stopColor="#E8743B" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="sr-amb-future" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9BAEC4" stopOpacity={0.04} />
            <stop offset="70%" stopColor="#9BAEC4" stopOpacity={0.01} />
            <stop offset="100%" stopColor="#9BAEC4" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Cartographic grid lines */}
        {gridLines.map((y, i) => (
          <line key={`g${i}`} x1={0} y1={y} x2={dims.w} y2={y}
            stroke="#8FA3C7" strokeWidth={0.3} opacity={0.018}
            strokeDasharray="6 28"
          />
        ))}

        {/* Ambient radial glows — era-colored regions */}
        {nodes.map((n, i) => (
          <circle key={`amb${i}`} cx={n.x} cy={n.y} r={isMobile ? 140 : 200}
            fill={`url(#sr-amb-${checkpoints[i].period})`}
          />
        ))}

        {/* Topographic contour ellipses */}
        {contours.map((c, i) => (
          <ellipse
            key={i}
            cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry}
            transform={`rotate(${c.rotation} ${c.cx} ${c.cy})`}
            fill="none" stroke="#8FA3C7" strokeWidth={0.5} opacity={c.opacity}
          />
        ))}

        {/* Open arc contours */}
        {topoArcs.map((a, i) => (
          <path key={`arc${i}`} d={a.d}
            fill="none" stroke="#8FA3C7" strokeWidth={0.4} opacity={a.opacity}
          />
        ))}

        {/* Dim full path — always visible */}
        <path d={pathD} stroke="#8FA3C7" strokeWidth={1} opacity={0.06} fill="none" strokeLinecap="round" />

        {/* Glow layer — temporal gradient */}
        <path ref={glowRef} d={pathD} stroke="url(#sr-temporal-glow)" strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#sr-glow-soft)" />

        {/* Core illuminated path — temporal gradient */}
        <path ref={pathRef} d={pathD} stroke="url(#sr-temporal)" strokeWidth={1.5} opacity={0.7} fill="none" strokeLinecap="round" />

        {/* Traveling dot */}
        <g ref={dotGroupRef} style={{ opacity: 0 }}>
          <circle ref={dotGlowRef} r={8} fill="#E8743B" opacity={0.2} filter="url(#sr-dot-glow)" />
          <circle ref={dotFillRef} r={3.5} fill="#E8743B" opacity={0.9} />
        </g>
      </svg>

      {/* Pin markers */}
      {nodes.map((pos, i) => {
        const cp = checkpoints[i]
        const isActive = i === activeIndex
        const isDone = i < activeIndex
        const color = PERIOD_COLORS[cp.period]

        return (
          <div
            key={cp.id}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -94%)',
              zIndex: isActive ? 20 : 10,
            }}
            onClick={() => scrollToCheckpoint(i)}
            role="button"
            tabIndex={0}
            aria-label={`Checkpoint ${i + 1}: ${cp.title}`}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToCheckpoint(i) } }}
          >
            {/* Pin silhouette */}
            <svg
              width="26" height="34"
              viewBox="0 0 26 34"
              className={`transition-all duration-500 ${isActive ? 'drop-shadow-[0_0_8px_rgba(232,116,59,0.3)]' : ''}`}
            >
              <path
                d="M13 33 C13 33 1 19 1 12 C1 5.9 6.4 1 13 1 C19.6 1 25 5.9 25 12 C25 19 13 33 13 33Z"
                fill={isActive ? color : isDone ? `${color}88` : '#151B35'}
                stroke={isActive ? color : isDone ? '#8FA3C7' : 'rgba(143,163,199,0.12)'}
                strokeWidth={isActive ? 0 : 0.75}
                className="transition-all duration-500"
              />
              <text
                x="13" y="13"
                textAnchor="middle"
                dominantBaseline="central"
                fill={isActive ? '#0A0F1E' : isDone ? '#B9C7DE' : 'rgba(143,163,199,0.3)'}
                fontSize="9"
                fontFamily="'JetBrains Mono', monospace"
                fontWeight="600"
              >
                {isDone ? '✓' : String(i + 1).padStart(2, '0')}
              </text>
            </svg>

          </div>
        )
      })}
    </div>
  )
}
