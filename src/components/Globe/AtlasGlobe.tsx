'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { countries, Country } from '@/data/countries'

// react-globe.gl is client-only; we dynamic-import it in the wrapper
import dynamic from 'next/dynamic'

interface GlobeFeature {
  id?: string
  properties?: Record<string, string>
  [key: string]: unknown
}

// ISO 3166-1 numeric → alpha-2 for countries in our dataset
const numericToAlpha2: Record<string, string> = {
  '004': 'AF', '008': 'AL', '012': 'DZ', '032': 'AR', '036': 'AU',
  '040': 'AT', '050': 'BD', '076': 'BR', '124': 'CA', '152': 'CL',
  '156': 'CN', '170': 'CO', '180': 'CD', '818': 'EG', '231': 'ET',
  '250': 'FR', '276': 'DE', '288': 'GH', '356': 'IN', '360': 'ID',
  '364': 'IR', '368': 'IQ', '376': 'IL', '380': 'IT', '392': 'JP',
  '404': 'KE', '410': 'KR', '484': 'MX', '504': 'MA', '566': 'NG',
  '408': 'KP', '578': 'NO', '586': 'PK', '608': 'PH', '616': 'PL',
  '643': 'RU', '682': 'SA', '702': 'SG', '710': 'ZA', '724': 'ES',
  '752': 'SE', '756': 'CH', '158': 'TW', '764': 'TH', '792': 'TR',
  '804': 'UA', '784': 'AE', '826': 'GB', '840': 'US', '704': 'VN',
}

const GLOBE_IMAGE = '//unpkg.com/three-globe@2.41.12/example/img/earth-dark.jpg'
const GEO_JSON_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json'

function AtlasGlobeInner() {
  const router = useRouter()
  const globeRef = useRef<any>(null)
  const [geoData, setGeoData] = useState<GlobeFeature[]>([])
  const [hovered, setHovered] = useState<GlobeFeature | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const containerRef = useRef<HTMLDivElement>(null)
  const GlobeModule = useRef<any>(null)
  const [GlobeComponent, setGlobeComponent] = useState<any>(null)

  useEffect(() => {
    import('react-globe.gl').then(mod => {
      setGlobeComponent(() => mod.default)
    })
  }, [])

  useEffect(() => {
    // Load and convert TopoJSON to GeoJSON
    fetch(GEO_JSON_URL)
      .then(r => r.json())
      .then(topology => {
        import('topojson-client').then(topojson => {
          const geo = topojson.feature(topology, topology.objects.countries) as any
          setGeoData(geo.features)
        }).catch(() => {
          // Fallback: load GeoJSON directly
          fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json')
            .then(r => r.json())
            .then(d => setGeoData(d.features || []))
        })
      })
  }, [])

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls()
      if (controls) {
        controls.autoRotate = true
        controls.autoRotateSpeed = 0.4
        controls.enableDamping = true
        controls.dampingFactor = 0.1
      }
      globeRef.current.pointOfView({ lat: 20, lng: 30, altitude: 2.2 })
    }
  }, [GlobeComponent])

  const countryLookup = useMemo(() => {
    const map = new Map<string, Country>()
    countries.forEach(c => map.set(c.code, c))
    return map
  }, [])

  const findCountry = useCallback((feat: GlobeFeature | null): Country | null => {
    if (!feat) return null
    const id = feat.id || ''
    const alpha2 = numericToAlpha2[id] || feat.properties?.ISO_A2 || ''
    return alpha2 ? countryLookup.get(alpha2) || null : null
  }, [countryLookup])

  const handleClick = useCallback((feat: GlobeFeature | null) => {
    const country = findCountry(feat)
    if (country) {
      router.push(`/country/${country.code}`)
    }
  }, [findCountry, router])

  const handleHover = useCallback((feat: GlobeFeature | null) => {
    setHovered(feat)
    if (globeRef.current) {
      const controls = globeRef.current.controls()
      if (controls) controls.autoRotate = !feat
    }
  }, [])

  const hoveredCountry = findCountry(hovered)

  if (!GlobeComponent) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-2 border-silver/20 border-t-copper rounded-full animate-spin" />
          <p className="text-silver/60 font-mono text-sm tracking-widest uppercase">Initializing Globe</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <GlobeComponent
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl={GLOBE_IMAGE}
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="#8FA3C7"
        atmosphereAltitude={0.15}
        polygonsData={geoData}
        polygonAltitude={(d: GlobeFeature) => d === hovered ? 0.03 : 0.006}
        polygonCapColor={(d: GlobeFeature) => {
          if (d === hovered) return 'rgba(232, 116, 59, 0.5)'
          return 'rgba(143, 163, 199, 0.08)'
        }}
        polygonSideColor={(d: GlobeFeature) => {
          if (d === hovered) return 'rgba(232, 116, 59, 0.3)'
          return 'rgba(143, 163, 199, 0.05)'
        }}
        polygonStrokeColor={() => 'rgba(143, 163, 199, 0.2)'}
        onPolygonHover={handleHover}
        onPolygonClick={handleClick}
        polygonLabel={(d: GlobeFeature) => {
          const c = findCountry(d)
          if (!c) return ''
          return `
            <div style="
              background: rgba(10, 15, 30, 0.95);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(143, 163, 199, 0.2);
              border-radius: 8px;
              padding: 12px 16px;
              max-width: 280px;
              font-family: Inter, sans-serif;
              color: #8FA3C7;
              box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            ">
              <div style="font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 600; color: #E8743B; margin-bottom: 6px;">
                ${c.name}
              </div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; opacity: 0.6; margin-bottom: 8px; text-transform: uppercase;">
                ${c.capital} · ${c.region}
              </div>
              <div style="font-size: 12px; line-height: 1.5; opacity: 0.8;">
                ${c.overview}
              </div>
              <div style="margin-top: 8px; font-size: 10px; color: #E8743B; opacity: 0.7;">
                Click to investigate →
              </div>
            </div>
          `
        }}
      />

      {/* Globe controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <button
          onClick={() => {
            if (globeRef.current) {
              const pov = globeRef.current.pointOfView()
              globeRef.current.pointOfView({ ...pov, altitude: Math.max(0.5, pov.altitude - 0.5) }, 400)
            }
          }}
          className="w-10 h-10 bg-glass border border-silver/20 rounded-lg flex items-center justify-center text-silver hover:text-copper hover:border-copper/30 transition-all"
          aria-label="Zoom in"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5"/></svg>
        </button>
        <button
          onClick={() => {
            if (globeRef.current) {
              const pov = globeRef.current.pointOfView()
              globeRef.current.pointOfView({ ...pov, altitude: Math.min(4, pov.altitude + 0.5) }, 400)
            }
          }}
          className="w-10 h-10 bg-glass border border-silver/20 rounded-lg flex items-center justify-center text-silver hover:text-copper hover:border-copper/30 transition-all"
          aria-label="Zoom out"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10" stroke="currentColor" strokeWidth="1.5"/></svg>
        </button>
        <button
          onClick={() => {
            if (globeRef.current) {
              globeRef.current.pointOfView({ lat: 20, lng: 30, altitude: 2.2 }, 800)
            }
          }}
          className="w-10 h-10 bg-glass border border-silver/20 rounded-lg flex items-center justify-center text-silver hover:text-copper hover:border-copper/30 transition-all"
          aria-label="Reset view"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/></svg>
        </button>
      </div>
    </div>
  )
}

export default AtlasGlobeInner
