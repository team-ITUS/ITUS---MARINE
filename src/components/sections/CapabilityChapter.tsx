import type { CapabilityChapterData } from '@/types'

interface CapabilityChapterProps {
  chapter: CapabilityChapterData
  index: number
}

export default function CapabilityChapter({ chapter, index }: CapabilityChapterProps) {
  return (
    <section
      id={chapter.id}
      className={`capability-chapter ${index % 2 ? 'chapter-dark' : 'chapter-light'}`}
    >
      <div className="container">
        <div className="chapter-number">0{index + 1}</div>
        <div className="chapter-copy">
          <h2>{chapter.title}</h2>
          {chapter.id === 'marine-systems' && (
            <p>
              Propulsion, navigation, monitoring and marine systems incorporated
              into complete vessel platforms around project requirements.
            </p>
          )}
          <ul>
            {chapter.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="chapter-image">
          <img src={chapter.image} alt={`${chapter.title} capability`} />
          <span>ITUS / CAP / 0{index + 1}</span>
        </div>
      </div>
    </section>
  )
}
