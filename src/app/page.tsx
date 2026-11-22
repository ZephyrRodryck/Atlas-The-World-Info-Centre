'use client'

import dynamic from 'next/dynamic'
import Header from '@/components/Header'

const AtlasGlobe = dynamic(() => import('@/components/Globe/AtlasGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-2 border-silver/20 border-t-copper rounded-full animate-spin" />
        <p className="text-silver/60 font-mono text-sm tracking-widest uppercase">Loading Globe</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      <Header />

      {/* Command center frame */}
      <main className="pt-16 h-screen flex flex-col">
        {/* Status bar */}
        <div className="px-4 md:px-8 py-3 border-b border-silver/8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-copper animate-pulse" />
              <span className="font-mono text-[11px] text-silver/40 tracking-wider uppercase">Global View Active</span>
            </div>
            <span className="hidden sm:inline text-silver/15">|</span>
            <span className="hidden sm:inline font-mono text-[11px] text-silver/30 tracking-wider">
              {new Date().toISOString().split('T')[0]}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-silver/30 tracking-wider">50 Countries Indexed</span>
          </div>
        </div>

        {/* Globe area */}
        <div className="flex-1 relative">
          {/* Corner accents */}
          <div className="absolute top-4 left-4 md:top-6 md:left-8 z-20 pointer-events-none">
            <div className="w-8 h-8 border-l border-t border-silver/8" />
          </div>
          <div className="absolute top-4 right-4 md:top-6 md:right-8 z-20 pointer-events-none">
            <div className="w-8 h-8 border-r border-t border-silver/8" />
          </div>
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-8 z-20 pointer-events-none">
            <div className="w-8 h-8 border-l border-b border-silver/8" />
          </div>
          <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8 z-20 pointer-events-none">
            <div className="w-8 h-8 border-r border-b border-silver/8" />
          </div>

          {/* Title overlay */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-silver-bright/90 tracking-tight">
              ATLAS
            </h1>
            <p className="mt-2 font-mono text-[11px] md:text-xs text-silver/40 tracking-[0.3em] uppercase">
              Understand Everything · Connect Anything
            </p>
          </div>

          {/* Instruction hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <p className="font-mono text-[10px] text-silver/25 tracking-widest uppercase animate-pulse">
              Hover to preview · Click to investigate
            </p>
          </div>

          <AtlasGlobe />
        </div>
      </main>
    </div>
  )
}
