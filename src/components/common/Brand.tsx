import { Link } from 'react-router-dom'

export default function Brand() {
  return (
    <Link className="brand" to="/" aria-label="ITUS Shipyard home">
      <strong>ITUS</strong>
      <span>SHIPYARD / ITUS MARINE</span>
    </Link>
  )
}
