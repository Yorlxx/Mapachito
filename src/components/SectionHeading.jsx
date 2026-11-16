export default function SectionHeading({ index, title, subtitle, id }) {
  return (
    <div className="section-head">
      <p className="section-index">
        <span>{index}</span>
        <i aria-hidden="true" />
      </p>
      <h2 className="section-title" id={id}>
        {title}
      </h2>
      {subtitle ? <p className="section-sub">{subtitle}</p> : null}
    </div>
  )
}
