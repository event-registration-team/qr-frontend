import './StatsCard.css';

interface StatsCardProps {
  title: string;
  value: number;
  description?: string;
}

export function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <article className="stats-card">
      <p className="stats-card__title">{title}</p>
      <strong className="stats-card__value">{value}</strong>

      {description && (
        <p className="stats-card__description">{description}</p>
      )}
    </article>
  );
}