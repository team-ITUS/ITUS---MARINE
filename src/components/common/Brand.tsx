import { Link } from 'react-router-dom'

export default function Brand() {
  return (
    <Link className="inline-flex w-fit flex-col gap-0.5" to="/" aria-label="ITUS Shipyard home">
      <strong className="font-display text-2xl font-semibold leading-none tracking-[.2em] text-white">
        ITUS
      </strong>
      <span className="text-[8px] font-semibold tracking-[.14em] text-white">SHIPYARD / ITUS MARINE</span>
    </Link>
  )
}
