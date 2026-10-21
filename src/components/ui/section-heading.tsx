type Props = {
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
};

export function SectionHeading({
  number,
  eyebrow,
  title,
  description,
  id,
}: Props) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">
          <span>{number}</span>
          {eyebrow}
        </p>
        <h2 id={id}>{title}</h2>
      </div>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
