import './StatsCard.css';

interface StatsCardProps {
  title: string;
  value: string;
  accent: string;
  icon: string;
}

export function StatsCard({ title, value, accent, icon }: StatsCardProps) {
  return (
    <article className="stats-card">
      <div className="stats-card__icon">{icon}</div>

      <strong className="stats-card__value">{value}</strong>

      <p className="stats-card__accent">{accent}</p>

      <p className="stats-card__title">{title}</p>
    </article>
  );
}