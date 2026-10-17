import { revealDelay } from '@/hooks/useReveal'
import type { CapabilityChapterData } from '@/types'

interface CapabilityChapterProps {
  chapter: CapabilityChapterData
  index: number
}

export default function CapabilityChapter({ chapter, index }: CapabilityChapterProps) {
  const dark = index % 2 === 1
  return (
    <section
      id={chapter.id}
      className={`min-h-[900px] scroll-mt-[70px] overflow-hidden sm:scroll-mt-[76px] lg:scroll-mt-[150px] py-[100px] sm:py-[150px] ${
        dark ? 'bg-carbon-black text-white' : 'bg-polar-white'
      }`}
    >
      <div className="container-site relative grid grid-cols-1 items-start gap-y-6 md:grid-cols-[minmax(0,.8fr)_minmax(0,1fr)] md:grid-rows-[auto_1fr] md:gap-x-[5%] lg:gap-x-[8%]">
        <div className="reveal self-start whitespace-nowrap font-display text-[90px] font-medium leading-[.8] text-oxide-red [-webkit-text-stroke:2px_var(--color-oxide-red)] [paint-order:stroke_fill] sm:text-[clamp(70px,9vw,140px)] md:col-start-1 md:row-start-1">
          0{index + 1}
        </div>
        <div className="md:col-start-1 md:row-start-2">
          <h2
            style={revealDelay(80)}
            className={`reveal my-6 font-display text-[clamp(36px,3.6vw,60px)] font-semibold leading-[.95] tracking-display [overflow-wrap:anywhere] ${
              dark ? 'text-white' : 'text-carbon-black'
            }`}
          >
            {chapter.title}
          </h2>
          {chapter.id === 'marine-systems' && (
            <p style={revealDelay(160)} className={`reveal text-base leading-[1.65] ${dark ? 'text-ice-grey' : 'text-slate-grey'}`}>
              Propulsion, navigation, monitoring and marine systems incorporated
              into complete vessel platforms around project requirements.
            </p>
          )}
          <ul
            className={`mt-11 list-none border-t p-0 ${
              dark ? 'border-dark-steel-border' : 'border-technical-border'
            }`}
          >
            {chapter.items.map((item, i) => (
              <li
                key={item}
                style={revealDelay(160 + Math.min(i, 5) * 60)}
                className={`reveal border-b py-[13px] text-[15px] leading-normal tracking-[.02em] ${
                  dark ? 'border-dark-steel-border text-ice-grey' : 'border-technical-border text-slate-grey'
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-[380px] overflow-hidden sm:h-[560px] md:col-start-2 md:row-span-2 md:row-start-1 md:h-[620px] md:self-center">
          <img className="reveal reveal-scale h-full object-cover" src={chapter.image} alt={`${chapter.title} capability`} />
          <span className="absolute bottom-4 right-4 bg-carbon-black px-2.5 py-2 text-xs tracking-[.04em] text-white">
            ITUS / CAP / 0{index + 1}
          </span>
        </div>
      </div>
    </section>
  )
}
