export default function LoadingSpinner({ label = 'Loading places...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-sand border-t-palm" />
      <p className="text-sm text-muted">{label}</p>
    </div>
  )
}
