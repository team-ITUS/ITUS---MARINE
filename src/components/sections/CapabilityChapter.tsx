import { revealDelay } from '@/hooks/useReveal'
import type { CapabilityChapterData } from '@/types'

interface CapabilityChapterProps {
  chapter: CapabilityChapterData
  index: number
}

/*
 * From lg the header (76px) and the chapter nav (~88px) are both sticky, leaving 100svh - 164px of usable height.
 * Padding, numeral, list spacing and image height scale with the viewport height there, so a whole chapter
 * (numeral, title, list and image) fits on a laptop screen at 100% zoom and nothing sits under the sticky bars.
 * Image: 100svh - 2 x 8svh padding - 164px chrome = 84svh - 164px, kept between 360px and 620px.
 */
export default function CapabilityChapter({ chapter, index }: CapabilityChapterProps) {
  const dark = index % 2 === 1
  return (
    <section
      id={chapter.id}
      className={`scroll-mt-[70px] overflow-hidden py-[100px] sm:scroll-mt-[76px] sm:py-[150px] md:py-[clamp(64px,10svh,150px)] lg:scroll-mt-[164px] lg:py-[clamp(48px,8svh,120px)] ${
        dark ? 'bg-carbon-black text-white' : 'bg-polar-white'
      }`}
    >
      <div className="container-site relative grid grid-cols-1 items-start gap-y-6 md:grid-cols-[minmax(0,.8fr)_minmax(0,1fr)] md:grid-rows-[auto_1fr] md:gap-x-[5%] lg:gap-x-[8%]">
        <div className="reveal self-start whitespace-nowrap font-display text-[90px] font-medium leading-[.8] text-oxide-red [-webkit-text-stroke:2px_var(--color-oxide-red)] [paint-order:stroke_fill] sm:text-[clamp(70px,9vw,140px)] lg:text-[clamp(64px,min(9vw,13svh),140px)] md:col-start-1 md:row-start-1">
          0{index + 1}
        </div>
        <div className="md:col-start-1 md:row-start-2">
          <h2
            style={revealDelay(80)}
            className={`reveal my-6 font-display text-[clamp(36px,3.6vw,60px)] font-semibold leading-[.95] tracking-display [overflow-wrap:anywhere] lg:my-[clamp(12px,2.5svh,24px)] ${
              dark ? 'text-white' : 'text-carbon-black'
            }`}
          >
            {chapter.title}
          </h2>
          <ul
            className={`mt-11 list-none border-t p-0 lg:mt-[clamp(20px,4svh,44px)] ${
              dark ? 'border-dark-steel-border' : 'border-technical-border'
            }`}
          >
            {chapter.items.map((item, i) => (
              <li
                key={item}
                style={revealDelay(160 + Math.min(i, 5) * 60)}
                className={`reveal border-b py-[13px] text-[15px] leading-normal tracking-[.02em] lg:py-[clamp(8px,1.5svh,13px)] ${
                  dark ? 'border-dark-steel-border text-ice-grey' : 'border-technical-border text-slate-grey'
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-[380px] overflow-hidden sm:h-[560px] md:col-start-2 md:row-span-2 md:row-start-1 md:h-[clamp(380px,calc(100svh_-_200px),620px)] md:self-center lg:h-[clamp(360px,calc(84svh_-_164px),620px)]">
          <img className="reveal reveal-scale h-full" src={chapter.image} alt={`${chapter.title} capability`} />
        </div>
      </div>
    </section>
  )
}
