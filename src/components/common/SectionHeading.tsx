interface SectionHeadingProps {
  title: string
  intro?: string
}

/** Section title. A newline in the title becomes a line break through the CSS. */
export default function SectionHeading({ title, intro }: SectionHeadingProps) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  )
}
