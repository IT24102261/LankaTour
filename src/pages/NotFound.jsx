import EmptyState from '../components/EmptyState'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <EmptyState
        title="Page not found"
        message="Sorry, this tourist attraction could not be found."
        actionLabel="Back to Home"
        actionTo="/"
      />
    </div>
  )
}
