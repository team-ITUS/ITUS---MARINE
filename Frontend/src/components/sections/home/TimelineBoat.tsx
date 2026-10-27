import PatrolCraft from '@/components/common/PatrolCraft'

/**
 * Desktop route line for the build timeline (lg and up). A `.reveal` element, so useReveal on the section
 * starts it: the amphibious craft drives off the land stretch on its wheels, rolls into the water at the shoreline,
 * retracts its wheels and sails on to the end of the route, drawing the route behind it. Each stage reveals as the
 * boat reaches it (delays in BuildTimeline match SAIL_START and SAIL_STEP).
 * All animation is CSS in index.css; reduced motion shows the finished state.
 */
export default function TimelineBoat() {
  return (
    <div className="reveal timeline-route" aria-hidden="true">
      <div className="timeline-route-line">
        <span className="timeline-land" />
        <span className="timeline-ground" />
        <span className="timeline-water" />
      </div>
      <div className="timeline-splash">
        <span />
        <span />
        <span className="timeline-spray" />
      </div>
      <div className="timeline-boat-carrier">
        <div className="timeline-boat">
          <span className="timeline-boat-foam" />
          <div className="timeline-boat-lift">
            {/* Same 240-unit width as the hull drawing; wheels sit under the hull, behind it, so retracting hides them. */}
            <svg className="timeline-boat-wheels" viewBox="0 0 240 76">
              <path d="M48 46H52V66H48ZM178 46H182V66H178Z" fill="var(--color-arctic-blue-grey)" />
              {[50, 180].map((cx) => (
                <g key={cx}>
                  <circle cx={cx} cy="66" r="9" fill="var(--color-carbon-black)" stroke="var(--color-ice-grey)" strokeWidth="2.4" />
                  <path
                    className="timeline-wheel-spokes"
                    d={`M${cx} 59V73M${cx - 7} 66H${cx + 7}`}
                    stroke="var(--color-arctic-blue-grey)"
                    strokeWidth="1.6"
                  />
                  <circle cx={cx} cy="66" r="2.2" fill="var(--color-oxide-red)" />
                </g>
              ))}
            </svg>
            <PatrolCraft className="timeline-boat-hull" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Sail timing shared with the stage reveal delays: start delay, and time between markers (6 legs to the route end). */
export const SAIL_START = 300
export const SAIL_STEP = 1000
