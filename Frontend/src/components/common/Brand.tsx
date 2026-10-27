import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { asset } from '@/utils/asset'

const logo = asset('/images/brand/itus-marine-logo.png')

/*
 * The logo's "ITUS" lettering is black, which disappears on the dark header and footer. A white layer masked
 * by the logo's own alpha and clipped to the lettering box repaints just those letters white; the emblem and
 * the red MARINE bar keep their original colours.
 */
const whiteLettering: CSSProperties = {
  WebkitMaskImage: `url(${logo})`,
  maskImage: `url(${logo})`,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  clipPath: 'inset(0 0 32% 43%)',
}

/** Site logo linking home. `className` sets the height (width follows the logo's aspect ratio). */
export default function Brand({ className = 'h-10 sm:h-11' }: { className?: string }) {
  return (
    <Link className="relative inline-block w-fit shrink-0" to="/" aria-label="ITUS Marine home">
      <img className={`block w-auto ${className}`} src={logo} alt="ITUS Marine" width={900} height={490} />
      <span aria-hidden="true" className="absolute inset-0 bg-white" style={whiteLettering} />
    </Link>
  )
}
