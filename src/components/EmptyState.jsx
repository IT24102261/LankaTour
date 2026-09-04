import { Link } from 'react-router-dom'

export default function EmptyState({
  title,
  message,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="rounded-3xl border border-dashed border-jungle/20 bg-white px-6 py-14 text-center">
      <h3 className="font-display text-2xl text-jungle">{title}</h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">{message}</p>
      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="mt-6 inline-flex rounded-xl bg-jungle px-5 py-3 text-sm font-semibold text-sand"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}
