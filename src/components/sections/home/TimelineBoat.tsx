import PatrolCraft from '@/components/common/PatrolCraft'

/**
 * Desktop route line for the build timeline (lg and up). A `.reveal` element, so useReveal on the section
 * starts it: the boat sails from the first stage marker to the end of the route, drawing the rule behind it, and each
 * stage reveals as the boat reaches it (delays in BuildTimeline match SAIL_START and SAIL_STEP).
 * All animation is CSS in index.css; reduced motion shows the finished state.
 */
export default function TimelineBoat() {
  return (
    <div className="reveal timeline-route" aria-hidden="true">
      <span className="timeline-route-line" />
      <div className="timeline-boat-carrier">
        <div className="timeline-boat">
          <span className="timeline-boat-foam" />
          <PatrolCraft className="timeline-boat-hull" />
        </div>
      </div>
    </div>
  )
}

/** Sail timing shared with the stage reveal delays: start delay, and time between markers (6 legs to the route end). */
export const SAIL_START = 300
export const SAIL_STEP = 600
