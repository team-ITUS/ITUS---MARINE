import { useId } from 'react'

interface PatrolCraftProps {
  className?: string
  /** Extra class on the oxide-red mast beacon, e.g. to make it blink. */
  beaconClassName?: string
}

/**
 * Patrol craft in profile, bow to the right, in light tones for dark sections. The waterline is y=56 of the
 * 240x64 drawing (87.5% down), so bob animations use `transform-origin: 50% 87.5%`. Decorative: wrap it in an
 * aria-hidden element.
 */
export default function PatrolCraft({ className, beaconClassName }: PatrolCraftProps) {
  const glass = `glass${useId().replace(/[^\w-]/g, '')}`
  return (
    <svg className={className} viewBox="0 0 240 64">
      <defs>
        <linearGradient id={glass} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-steel-blue)" />
          <stop offset="1" stopColor="var(--color-carbon-black)" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="var(--color-arctic-blue-grey)" strokeWidth="1.2" strokeLinecap="round">
        <path d="M16 40V34M34 40V34M52 40V34M16 34H64L70 40" />
        <path d="M162 40V35.5M182 40V35.5M202 40V35M162 35.5H202L226 33" />
        <path d="M108 21V8M128 21L130 4" strokeWidth="1.6" />
      </g>
      <rect x="98" y="7.6" width="20" height="2.4" fill="var(--color-ice-grey)" />
      <circle className={beaconClassName} cx="108" cy="5.6" r="1.6" fill="var(--color-oxide-red)" />
      <path d="M78 24L80 21H142L144 24Z" fill="var(--color-ice-grey)" />
      <path d="M74 40L82 24H138L156 40Z" fill="var(--color-arctic-blue-grey)" />
      <path d="M86 27H134L146 36H82Z" fill={`url(#${glass})`} />
      <path d="M101 27V36M117 27V36M133 27L136 36" stroke="var(--color-arctic-blue-grey)" strokeWidth="1.6" />
      <path d="M10 40H206C220 40 230 37 238 31L234 41C228 52 214 59 192 60H16L10 54Z" fill="var(--color-ice-grey)" />
      <path d="M10 43H231L229 46H10Z" fill="var(--color-oxide-red)" />
      <path d="M12 53H221C216 57 206 60 192 60H16Z" fill="var(--color-arctic-blue-grey)" />
    </svg>
  )
}
