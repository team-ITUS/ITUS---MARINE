interface SectionHeadingProps {
  title: string
  intro?: string
}

/** Section title. A newline in the title becomes a line break (whitespace-pre-line). */
export default function SectionHeading({ title, intro }: SectionHeadingProps) {
  return (
    <div className="max-w-[850px]">
      <h2 className="m-0 whitespace-pre-line font-display text-[40px] font-semibold leading-[.98] tracking-display sm:text-[clamp(44px,5vw,66px)]">
        {title}
      </h2>
      {intro && (
        <p className="max-w-[610px] text-base leading-[1.65] text-slate-grey">
          {intro}
        </p>
      )}
    </div>
  )
}
