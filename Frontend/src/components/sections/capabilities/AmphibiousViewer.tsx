import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Label from '@/components/common/Label'
import Lightbox from '@/components/sections/gallery/Lightbox'
import { boatCameraPresets, boatFeatures, boatHullFinishes, boatRenders } from '@/data/amphibious'
import type { BoatCameraView } from '@/types'
import { asset } from '@/utils/asset'

const BoatScene = lazy(() => import('./BoatScene'))

const DEFAULT_PRESET = boatCameraPresets[0]
const POSTER = boatRenders[0]

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
 * Capabilities page: interactive 3D amphibious boat. Drag to orbit, scroll or pinch to zoom, jump to camera
 * presets, raise and lower the wheels, cut the hull in half, change the hull finish, and pick numbered features.
 * The three.js scene is a separate chunk, loaded when the section nears the viewport. Without WebGL, the design
 * render is shown instead. The renders below open in the gallery lightbox.
 */
export default function AmphibiousViewer() {
  const stageRef = useRef<HTMLDivElement>(null)
  const [reducedMotion] = useState(prefersReducedMotion)
  const [webgl] = useState(hasWebGL)
  const [mounted, setMounted] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const [view, setView] = useState<{ camera: BoatCameraView; key: number; presetId: string | null }>({
    camera: DEFAULT_PRESET,
    key: 0,
    presetId: DEFAULT_PRESET.id,
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deployed, setDeployed] = useState(true)
  const [section, setSection] = useState(false)
  const [finish, setFinish] = useState(boatHullFinishes[0])
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

  const goTo = (camera: BoatCameraView, presetId: string | null) => {
    setView((current) => ({ camera, key: current.key + 1, presetId }))
    setAutoRotate(false)
  }

  const selectFeature = (id: string) => {
    const feature = boatFeatures.find((item) => item.id === id)
    if (!feature) return
    setSelectedId(id)
    if (feature.section) setSection(true)
    goTo(feature.view, null)
  }

  const reset = () => {
    setSelectedId(null)
    setSection(false)
    setDeployed(true)
    goTo(DEFAULT_PRESET, DEFAULT_PRESET.id)
    setAutoRotate(!reducedMotion)
  }

  const selectedIndex = boatFeatures.findIndex((item) => item.id === selectedId)
  const selected = boatFeatures[selectedIndex]
  const poster = <Poster note={webgl ? 'Loading 3D model' : 'Showing design render: 3D view needs WebGL'} />

  return (
    <section
      id="amphibious-platform"
      className="scroll-mt-[70px] bg-carbon-black py-[100px] text-white sm:scroll-mt-[76px] sm:py-[150px] md:py-[clamp(64px,10svh,150px)] lg:scroll-mt-[164px]"
    >
      <div className="container-site">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,.8fr)] md:items-end">
          <div>
            <Label tone="light">Interactive Model</Label>
            <h2 className="reveal mt-6 font-display text-[40px] font-semibold leading-[.98] tracking-display sm:text-[clamp(44px,5vw,66px)]">
              Amphibious
              <br />
              Platform.
            </h2>
          </div>
          <p className="max-w-[520px] text-base leading-[1.65] text-arctic-blue-grey">
            Explore our amphibious patrol and rescue craft: a deep-V hull with an enclosed wheelhouse, twin outboards and a
            three-leg undercarriage that drives it from the water onto the beach.
          </p>
        </div>

        <div className="mt-12 grid gap-px border border-dark-steel-border bg-dark-steel-border lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 bg-carbon-black">
            <div
              ref={stageRef}
              className="relative h-[420px] overflow-hidden bg-[radial-gradient(ellipse_at_50%_38%,#2F4652_0%,#18222A_45%,#0E1418_80%)] sm:h-[540px] lg:h-[620px]"
            >
              {webgl && mounted ? (
                <SceneBoundary fallback={<Poster note="The 3D view could not start. Showing design render." />}>
                  <Suspense fallback={poster}>
                    <BoatScene
                      view={view.camera}
                      viewKey={view.key}
                      features={boatFeatures}
                      selectedId={selectedId}
                      onSelect={selectFeature}
                      finish={finish}
                      deployed={deployed}
                      section={section}
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
                  <p className="pointer-events-none absolute bottom-4 left-4 m-0 hidden text-[12px] uppercase tracking-ui text-arctic-blue-grey sm:block">
                    Drag to rotate · Scroll to zoom · Right-drag to pan
                  </p>
                  <div className="absolute bottom-3 right-3 flex gap-2 sm:bottom-4 sm:right-4">
                    <StageButton
                      label={autoRotate ? 'Stop auto-rotate' : 'Start auto-rotate'}
                      pressed={autoRotate}
                      onClick={() => setAutoRotate((value) => !value)}
                    >
                      <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4" />
                    </StageButton>
                    <StageButton label="Reset view" onClick={reset}>
                      <path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v4h4" />
                    </StageButton>
                  </div>
                </>
              )}
            </div>

            {webgl && (
              <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-dark-steel-border p-4 sm:p-5">
                <ToolGroup label="View">
                  {boatCameraPresets.map((preset) => (
                    <Toggle
                      key={preset.id}
                      pressed={view.presetId === preset.id}
                      onClick={() => {
                        setSelectedId(null)
                        goTo(preset, preset.id)
                      }}
                    >
                      {preset.label}
                    </Toggle>
                  ))}
                </ToolGroup>
                <ToolGroup label="Mode">
                  <Toggle pressed={deployed} onClick={() => setDeployed(true)}>
                    Land
                  </Toggle>
                  <Toggle pressed={!deployed} onClick={() => setDeployed(false)}>
                    Water
                  </Toggle>
                  <Toggle pressed={section} onClick={() => setSection((value) => !value)}>
                    Section
                  </Toggle>
                </ToolGroup>
              </div>
            )}
          </div>

          <aside className="flex flex-col bg-carbon-black" aria-label="Boat features">
            <div className="min-h-[230px] border-b border-dark-steel-border p-6" aria-live="polite">
              {selected ? (
                <>
                  <span className="text-[13px] font-semibold text-oxide-red">0{selectedIndex + 1}</span>
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
                  <Link to="/contact" className="action mt-6">
                    Discuss this platform <span aria-hidden="true">→</span>
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="mb-3 mt-0 font-display text-[28px] font-semibold leading-none tracking-display">
                    Explore the boat
                  </h3>
                  <p className="m-0 text-[15px] leading-[1.6] text-ice-grey">
                    Select a numbered point on the model, or a feature below, to fly the camera to it and see what it
                    does.
                  </p>
                </>
              )}
            </div>

            <ol className="m-0 list-none p-0">
              {boatFeatures.map((feature, index) => (
                <li key={feature.id}>
                  <button
                    type="button"
                    aria-pressed={selectedId === feature.id}
                    onClick={() => selectFeature(feature.id)}
                    className={`flex w-full cursor-pointer items-center gap-4 border-b border-dark-steel-border px-6 py-3 text-left text-[14px] tracking-[.02em] transition-colors duration-200 ${
                      selectedId === feature.id ? 'bg-steel-blue text-white' : 'text-ice-grey hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="w-5 text-[12px] font-semibold text-oxide-red">0{index + 1}</span>
                    {feature.name}
                  </button>
                </li>
              ))}
            </ol>

            {webgl && (
              <div className="mt-auto p-6">
                <div className="mb-3 text-[12px] font-semibold uppercase tracking-label text-arctic-blue-grey">Hull finish</div>
                <div className="flex flex-wrap gap-2">
                  {boatHullFinishes.map((option) => (
                    <Toggle key={option.id} pressed={finish.id === option.id} onClick={() => setFinish(option)}>
                      <span
                        aria-hidden="true"
                        className="h-3 w-3 rounded-full border border-white/40"
                        style={{ background: option.color }}
                      />
                      {option.label}
                    </Toggle>
                  ))}
                </div>
              </div>
            )}
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
