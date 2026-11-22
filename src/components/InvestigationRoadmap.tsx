'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

export interface RoadmapNode {
  id: string
  label: string
  short: string
}

interface Props {
  nodes: RoadmapNode[]
  activeIndex: number
  visitedIndices: Set<number>
  onNodeSelect: (index: number) => void
}

function layoutNodes(
  count: number, w: number, h: number, vertical: boolean
): [number, number][] {
  if (count === 0) return []
  const result: [number, number][] = []
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1)
    if (vertical) {
      const pad = { x: w * 0.12, y: h * 0.03 }
      const y = pad.y + t * (h - pad.y * 2)
      const swing = (i % 2 === 0 ? -1 : 1) * (w * 0.25)
      result.push([w / 2 + swing, y])
    } else {
      const pad = { x: w * 0.09, y: h * 0.22 }
      const x = pad.x + t * (w - pad.x * 2)
      const swing = (i % 2 === 0 ? -1 : 1) * (h * 0.26)
      result.push([x, h / 2 + swing])
    }
  }
  return result
}

// Cubic Bézier with horizontal (or vertical) tangent control points
function bezier(
  x1: number, y1: number, x2: number, y2: number, vertical: boolean
): string {
  if (vertical) {
    const dy = y2 - y1
    return `M${x1},${y1} C${x1},${y1 + dy * 0.5} ${x2},${y2 - dy * 0.5} ${x2},${y2}`
  }
  const dx = x2 - x1
  return `M${x1},${y1} C${x1 + dx * 0.5},${y1} ${x2 - dx * 0.5},${y2} ${x2},${y2}`
}

export default function InvestigationRoadmap({ nodes, activeIndex, visitedIndices, onNodeSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 900, h: 320 })
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      if (width > 0 && height > 0) setDims({ w: width, h: height })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const vertical = dims.w < 640
  const positions = useMemo(
    () => layoutNodes(nodes.length, dims.w, dims.h, vertical),
    [nodes.length, dims.w, dims.h, vertical]
  )

  const paths = useMemo(() =>
    positions.slice(0, -1).map((p, i) => ({
      d: bezier(p[0], p[1], positions[i + 1][0], positions[i + 1][1], vertical),
      from: i,
      to: i + 1,
    })),
    [positions, vertical]
  )

  const nodeState = (i: number) =>
    i === activeIndex ? 'current' : visitedIndices.has(i) ? 'done' : 'upcoming'

  const pathState = (from: number, to: number) => {
    if (nodeState(from) === 'done' && nodeState(to) !== 'upcoming') return 'done'
    if (from === activeIndex || to === activeIndex) return 'active'
    return 'upcoming'
  }

  const isConnected = (i: number) =>
    hovered !== null && (i === hovered || i === hovered - 1 || i === hovered + 1)

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{ height: vertical ? Math.max(500, nodes.length * 62) : 320 }}
    >
      {/* SVG paths */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <filter id="rm-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
          <filter id="rm-glow-strong">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
        </defs>

        {paths.map((p, i) => {
          const st = pathState(p.from, p.to)
          const lit = isConnected(p.from) || isConnected(p.to)
          const isActive = st === 'active'
          const isDone = st === 'done'
          const baseOpacity = isActive ? 0.35 : isDone ? 0.18 : 0.06
          const coreOpacity = isActive ? 0.8 : isDone ? 0.3 : 0.12
          const color = isActive ? '#E8743B' : '#8FA3C7'

          return (
            <g key={i}>
              {/* Outer glow */}
              <path
                d={p.d}
                stroke={color}
                strokeWidth={isActive ? 6 : 4}
                opacity={lit ? baseOpacity * 1.8 : baseOpacity}
                filter={isActive ? 'url(#rm-glow-strong)' : 'url(#rm-glow)'}
                className="transition-opacity duration-500"
              />
              {/* Core line */}
              <path
                d={p.d}
                stroke={color}
                strokeWidth={isActive ? 1.5 : 1}
                opacity={lit ? coreOpacity * 1.4 : coreOpacity}
                strokeLinecap="round"
                className="transition-opacity duration-500"
              />
              {/* Traveling light on active paths */}
              {isActive && (
                <path
                  d={p.d}
                  stroke="#E8743B"
                  strokeWidth={2}
                  opacity={0.9}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="0.06 0.94"
                  className="rm-travel"
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => {
        if (i >= positions.length) return null
        const [x, y] = positions[i]
        const st = nodeState(i)
        const isCurrent = st === 'current'
        const isDone = st === 'done'

        return (
          <button
            key={node.id}
            onClick={() => onNodeSelect(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            className={`rm-node absolute -translate-x-1/2 -translate-y-1/2 group
              focus:outline-none focus-visible:ring-2 focus-visible:ring-copper/60 rounded-lg
              transition-all duration-300 ${isCurrent ? 'z-20' : 'z-10'}`}
            style={{ left: x, top: y }}
            aria-label={`${node.label}${isDone ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm
              transition-all duration-300 group-hover:scale-[1.04]
              ${isCurrent
                ? 'bg-copper/12 border-copper/40 shadow-[0_0_20px_rgba(232,116,59,0.15)]'
                : isDone
                  ? 'bg-navy-100/80 border-silver/20 group-hover:border-silver/35'
                  : 'bg-navy/70 border-silver/8 group-hover:border-silver/18 opacity-60 group-hover:opacity-90'
              }`}>
              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                font-mono text-[10px] font-semibold leading-none transition-colors
                ${isCurrent
                  ? 'bg-copper text-navy-400'
                  : isDone
                    ? 'bg-silver/15 text-silver'
                    : 'bg-silver/6 text-silver/35'
                }`}>
                {isDone ? '✓' : String(i + 1).padStart(2, '0')}
              </span>
              <span className={`text-xs font-medium whitespace-nowrap transition-colors
                ${isCurrent ? 'text-copper' : isDone ? 'text-silver/80' : 'text-silver/40'}`}>
                {dims.w < 1200 ? node.short : node.label}
              </span>
            </div>

            {isCurrent && (
              <div className="absolute -inset-1.5 rounded-xl border border-copper/15 rm-pulse pointer-events-none" />
            )}
          </button>
        )
      })}
    </div>
  )
}
