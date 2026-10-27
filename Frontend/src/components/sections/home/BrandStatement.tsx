import { revealDelay, useReveal } from '@/hooks/useReveal'

export default function BrandStatement() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="relative overflow-hidden bg-ice-grey py-[110px] md:py-[170px]">
      <div className="hull-figure" aria-hidden="true">
        <div className="hull-skew">
          <div className="hull-outer">
            <span className="hull-mid" />
            <span className="hull-inner" />
          </div>
        </div>
      </div>
      <div className="container-site relative grid grid-cols-1 items-center gap-10 md:grid-cols-[auto_minmax(0,380px)] md:justify-start md:gap-[clamp(40px,8vw,140px)]">
        <div className="flex flex-col font-display text-[44px] font-semibold uppercase leading-[.88] tracking-[-.06em] sm:text-[clamp(54px,7.3vw,104px)]">
          <span className="reveal text-carbon-black">Engineered.</span>
          <span style={revealDelay(120)} className="reveal text-ice-grey [-webkit-text-stroke:2px_var(--color-oxide-red)] [paint-order:stroke_fill]">
            Integrated.
          </span>
          <span style={revealDelay(240)} className="reveal text-steel-blue">Sustained.</span>
        </div>
        <div className="reveal" style={revealDelay(400)}>
          <p className="m-0 max-w-[380px] font-display text-2xl leading-[1.55] text-slate-grey">
            ITUS consolidates vessel construction, marine engineering, systems
            integration and through‑life support within a unified capability
            tailored to specialised maritime requirements.
          </p>
        </div>
      </div>
    </section>
  )
}
