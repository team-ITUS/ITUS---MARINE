import { Component, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Label from '@/components/common/Label'
import Lightbox from '@/components/sections/gallery/Lightbox'
import { boatCameraPresets, boatFeatures, boatLayers, boatModeViews, boatRenders } from '@/data/amphibious'
import type { BoatCameraPreset, BoatViewMode } from '@/types'
import { asset } from '@/utils/asset'
import type { BoatShot } from './BoatScene'

const BoatScene = lazy(() => import('./BoatScene'))

const DEFAULT_PRESET = boatCameraPresets[0]
const POSTER = boatRenders[0]
const MODES: { id: BoatViewMode; label: string }[] = [
  { id: 'exterior', label: 'Exterior' },
  { id: 'interior', label: 'Interior' },
  { id: 'cutaway', label: 'Cutaway' },
]

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return Boolean(gl)
  } catch {
    return false
  }
}

/**
 * Capabilities page: 3D configurator for the 10.2 m amphibious boat, built from the CAD assembly. Drag to orbit,
 * scroll or pinch to zoom, jump to camera views, switch between Exterior, Interior (roof lifted) and Cutaway
 * (hull cut on the centreline), raise and lower the wheels, steer the outboards, hide groups of parts, and select
 * a part on the model or in the list to see what it does. The three.js scene is a separate chunk, loaded when the
 * section nears the viewport. Without WebGL, the design render is shown instead. The renders below open in the
 * gallery lightbox.
 */
export default function AmphibiousViewer() {
  const stageRef = useRef<HTMLDivElement>(null)
  const [reducedMotion] = useState(prefersReducedMotion)
  const [webgl] = useState(hasWebGL)
  const [mounted, setMounted] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const [shot, setShot] = useState<BoatShot>({ key: 0, camera: DEFAULT_PRESET })
  const [presetId, setPresetId] = useState<string | null>(DEFAULT_PRESET.id)
  const [mode, setMode] = useState<BoatViewMode>('exterior')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deployed, setDeployed] = useState(true)
  const [steering, setSteering] = useState(0)
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(() => new Set())
  const [available, setAvailable] = useState<Set<string> | null>(null)
  const [autoRotate, setAutoRotate] = useState(!reducedMotion)
  const [lightbox, setLightbox] = useState<{ index: number; opener: HTMLElement | null } | null>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting)
        if (entry.isIntersecting) setMounted(true)
      },
      { rootMargin: '300px 0px' },
    )
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  // Features whose parts are in the loaded model (all of them until it has loaded).
  const features = useMemo(
    () => (available ? boatFeatures.filter((feature) => available.has(feature.id)) : boatFeatures),
    [available],
  )
  const layers = boatLayers.filter((layer) => layer.features.some((id) => features.some((feature) => feature.id === id)))
  const hiddenFeatures = useMemo(
    () => new Set(boatLayers.filter((layer) => hiddenLayers.has(layer.id)).flatMap((layer) => layer.features)),
    [hiddenLayers],
  )
  const handleLoaded = useCallback((ids: string[]) => setAvailable(new Set(ids)), [])

  const moveCamera = (next: Omit<BoatShot, 'key'>, preset: BoatCameraPreset | null) => {
    setShot((current) => ({ ...next, key: current.key + 1 }))
    setPresetId(preset?.id ?? null)
    setAutoRotate(false)
  }

  const goToPreset = (preset: BoatCameraPreset) => {
    setSelectedId(null)
    moveCamera({ camera: preset }, preset)
  }

  const changeMode = (next: BoatViewMode) => {
    setMode(next)
    setSelectedId(null)
    const view = boatModeViews[next]
    moveCamera({ camera: view }, boatCameraPresets.includes(view) ? view : null)
  }

  const selectFeature = (id: string) => {
    const feature = boatFeatures.find((item) => item.id === id)
    if (!feature) return
    setSelectedId(id)
    if (feature.mode) setMode(feature.mode)
    // Show the feature again if its layer is switched off.
    setHiddenLayers((current) => new Set([...current].filter((layerId) => !boatLayers.find((layer) => layer.id === layerId)?.features.includes(id))))
    moveCamera({ featureId: id }, null)
  }

  const toggleLayer = (id: string) =>
    setHiddenLayers((current) => {
      const next = new Set(current)
      if (!next.delete(id)) next.add(id)
      return next
    })

  const reset = () => {
    setSelectedId(null)
    setMode('exterior')
    setDeployed(true)
    setSteering(0)
    setHiddenLayers(new Set())
    moveCamera({ camera: DEFAULT_PRESET }, DEFAULT_PRESET)
    setAutoRotate(!reducedMotion)
  }

  const selected = features.find((item) => item.id === selectedId)
  const number = (id: string) => String(features.findIndex((item) => item.id === id) + 1).padStart(2, '0')
  const poster = <Poster note={webgl ? 'Loading 3D model' : 'Showing design render: 3D view needs WebGL'} />

  return (
    <section
      id="amphibious-platform"
      className="scroll-mt-[70px] bg-carbon-black py-[100px] text-white sm:scroll-mt-[76px] sm:py-[150px] md:py-[clamp(64px,10svh,150px)] lg:scroll-mt-[76px]"
    >
      <div className="container-site">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,.8fr)] md:items-end">
          <div>
            <Label tone="light">3D Configurator</Label>
            <h2 className="reveal mt-6 font-display text-[40px] font-semibold leading-[.98] tracking-display sm:text-[clamp(44px,5vw,66px)]">
              10.2M Amphibious
              <br />
              Luxury.
            </h2>
          </div>
          <p className="max-w-[520px] text-base leading-[1.65] text-arctic-blue-grey">
            Explore the boat from our engineering model: walk round the outside, lift the roof to see the wheelhouse,
            cut the hull open, raise the wheels for the water and steer the twin outboards.
          </p>
        </div>

        <div className="mt-12 grid gap-px border border-dark-steel-border bg-dark-steel-border lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 bg-carbon-black">
            <div
              ref={stageRef}
              className="relative h-[420px] overflow-hidden bg-[radial-gradient(ellipse_at_50%_38%,#2F4652_0%,#18222A_45%,#0E1418_80%)] sm:h-[540px] lg:h-[clamp(560px,calc(100svh-230px),760px)]"
            >
              {webgl && mounted ? (
                <SceneBoundary fallback={<Poster note="The 3D view could not start. Showing design render." />}>
                  <Suspense fallback={poster}>
                    <BoatScene
                      shot={shot}
                      features={features}
                      selectedId={selectedId}
                      onSelect={selectFeature}
                      onLoaded={handleLoaded}
                      mode={mode}
                      deployed={deployed}
                      steering={steering}
                      hiddenFeatures={hiddenFeatures}
                      autoRotate={autoRotate}
                      onInteract={() => setAutoRotate(false)}
                      active={onScreen}
                      reducedMotion={reducedMotion}
                    />
                  </Suspense>
                </SceneBoundary>
              ) : (
                poster
              )}

              {webgl && (
                <>
                  <div role="group" aria-label="View mode" className="absolute left-3 top-3 flex sm:left-4 sm:top-4">
                    {MODES.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={mode === item.id}
                        onClick={() => changeMode(item.id)}
                        className={`min-h-9 cursor-pointer border px-3 text-[12px] font-semibold uppercase tracking-ui transition-colors duration-200 [&+&]:-ml-px ${
                          mode === item.id
                            ? 'relative border-oxide-red bg-oxide-red text-white'
                            : 'border-white/25 bg-carbon-black/60 text-ice-grey hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <p className="pointer-events-none absolute bottom-4 left-4 m-0 hidden text-[12px] uppercase tracking-ui text-arctic-blue-grey sm:block">
                    Drag to rotate · Scroll to zoom · Click a part for details
                  </p>
                  <div className="absolute bottom-3 right-3 flex gap-2 sm:bottom-4 sm:right-4">
                    <StageButton
                      label={autoRotate ? 'Stop auto-rotate' : 'Start auto-rotate'}
                      pressed={autoRotate}
                      onClick={() => setAutoRotate((value) => !value)}
                    >
                      <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4" />
                    </StageButton>
                    <StageButton label="Reset" onClick={reset}>
                      <path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v4h4" />
                    </StageButton>
                  </div>
                </>
              )}
            </div>

            {webgl && (
              <div className="grid gap-x-8 gap-y-4 border-t border-dark-steel-border p-4 sm:p-5 xl:grid-cols-2">
                <ToolGroup label="Camera">
                  {boatCameraPresets.map((preset) => (
                    <Toggle key={preset.id} pressed={presetId === preset.id} onClick={() => goToPreset(preset)}>
                      {preset.label}
                    </Toggle>
                  ))}
                </ToolGroup>
                <ToolGroup label="Wheels">
                  <Toggle pressed={deployed} onClick={() => setDeployed(true)}>
                    Down · Land
                  </Toggle>
                  <Toggle pressed={!deployed} onClick={() => setDeployed(false)}>
                    Up · Water
                  </Toggle>
                </ToolGroup>
                <ToolGroup label="Show">
                  {layers.map((layer) => (
                    <Toggle key={layer.id} pressed={!hiddenLayers.has(layer.id)} onClick={() => toggleLayer(layer.id)}>
                      {layer.label}
                    </Toggle>
                  ))}
                </ToolGroup>
                {features.some((feature) => feature.id === 'engines') && (
                  <ToolGroup label="Steering">
                    <span aria-hidden="true" className="text-[12px] text-arctic-blue-grey">
                      Port
                    </span>
                    <input
                      type="range"
                      min={-1}
                      max={1}
                      step={0.05}
                      value={steering}
                      onChange={(event) => setSteering(Number(event.target.value))}
                      onDoubleClick={() => setSteering(0)}
                      aria-label="Outboard steering"
                      aria-valuetext={steering === 0 ? 'Centred' : `${Math.round(Math.abs(steering) * 100)}% to ${steering < 0 ? 'port' : 'starboard'}`}
                      className="w-36 cursor-pointer accent-oxide-red"
                    />
                    <span aria-hidden="true" className="text-[12px] text-arctic-blue-grey">
                      Stbd
                    </span>
                  </ToolGroup>
                )}
              </div>
            )}
          </div>

          <aside className="flex flex-col bg-carbon-black" aria-label="Boat features">
            <div className="border-b sm:min-h-[230px] border-dark-steel-border p-6" aria-live="polite">
              {selected ? (
                <>
                  <span className="text-[13px] font-semibold text-oxide-red">{number(selected.id)}</span>
                  <h3 className="mb-3 mt-2 font-display text-[28px] font-semibold leading-none tracking-display">
                    {selected.name}
                  </h3>
                  <p className="m-0 text-[15px] leading-[1.6] text-ice-grey">{selected.description}</p>
                  <ul className="mt-4 list-none space-y-1.5 p-0">
                    {selected.highlights.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[14px] text-arctic-blue-grey">
                        <span aria-hidden="true" className="text-oxide-red">
                          —
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h3 className="mb-3 mt-0 font-display text-[28px] font-semibold leading-none tracking-display">
                    Explore the boat
                  </h3>
                  <p className="m-0 text-[15px] leading-[1.6] text-ice-grey">
                    Tap a part of the model or a numbered point<span className="max-sm:hidden">, or a feature below,</span> to fly
                    the camera to it and see what it does.
                  </p>
                </>
              )}
            </div>

            {/* The list repeats the numbered points; phones leave it out to keep the panel short. */}
            <ol className="m-0 list-none p-0 max-sm:hidden">
              {features.map((feature) => (
                <li key={feature.id}>
                  <button
                    type="button"
                    aria-pressed={selectedId === feature.id}
                    onClick={() => selectFeature(feature.id)}
                    className={`flex w-full cursor-pointer items-center gap-4 border-b border-dark-steel-border px-6 py-3 text-left text-[14px] tracking-[.02em] transition-colors duration-200 ${
                      selectedId === feature.id ? 'bg-steel-blue text-white' : 'text-ice-grey hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="w-5 text-[12px] font-semibold text-oxide-red">{number(feature.id)}</span>
                    {feature.name}
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-auto p-6">
              <Link to="/contact" className="action">
                Request a quote <span aria-hidden="true">→</span>
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-14">
          <Label tone="light">Design Renders</Label>
          <ul className="mt-6 grid list-none grid-cols-2 gap-px border border-dark-steel-border bg-dark-steel-border p-0 sm:grid-cols-4 lg:grid-cols-7">
            {boatRenders.map((render, index) => (
              <li key={render.id} className="bg-carbon-black">
                <button
                  type="button"
                  aria-label={`Open render: ${render.alt}`}
                  onClick={(event) => setLightbox({ index, opener: event.currentTarget })}
                  className="group block aspect-[4/3] w-full cursor-pointer overflow-hidden bg-[#e4e6e7]"
                >
                  <img
                    src={asset(render.thumbnail)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {lightbox && (
        <Lightbox
          photos={boatRenders}
          index={lightbox.index}
          onIndexChange={(index) => setLightbox((current) => current && { ...current, index })}
          onClose={() => setLightbox(null)}
          returnFocus={lightbox.opener}
        />
      )}
    </section>
  )
}

function Poster({ note }: { note: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#e4e6e7]">
      <img src={asset(POSTER.src)} alt={POSTER.alt} className="h-full object-contain" />
      <span className="absolute left-4 top-4 bg-carbon-black/80 px-3 py-2 text-[12px] uppercase tracking-ui text-ice-grey">
        {note}
      </span>
    </div>
  )
}

function ToolGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[12px] font-semibold uppercase tracking-label text-arctic-blue-grey">{label}</span>
      {children}
    </div>
  )
}

function Toggle({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex min-h-9 cursor-pointer items-center gap-2 border px-3 text-[12px] font-semibold uppercase tracking-ui transition-colors duration-200 ${
        pressed
          ? 'border-oxide-red bg-oxide-red text-white'
          : 'border-dark-steel-border text-ice-grey hover:border-arctic-blue-grey hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

function StageButton({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string
  pressed?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      onClick={onClick}
      className="grid h-10 w-10 cursor-pointer place-items-center border border-white/25 bg-carbon-black/60 text-white transition-colors duration-200 hover:border-oxide-red hover:bg-oxide-red"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        {children}
      </svg>
    </button>
  )
}

/** Shows `fallback` if the 3D chunk fails to load or the WebGL context cannot be created. */
class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
