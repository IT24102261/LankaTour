import SearchBar from './SearchBar'

export default function FilterPanel({ values, onChange, onSubmit, onClear, resultCount }) {
  return (
    <section className="rounded-3xl border border-jungle/10 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-2xl text-jungle">Find places</h2>
          <p className="text-sm text-muted">Filter by name, district, category or entry type.</p>
        </div>
        {typeof resultCount === 'number' ? (
          <p className="rounded-full bg-sand px-3 py-1 text-sm font-semibold text-jungle">
            {resultCount} {resultCount === 1 ? 'place' : 'places'} found
          </p>
        ) : null}
      </div>
      <SearchBar
        values={values}
        onChange={onChange}
        onSubmit={onSubmit}
        onClear={onClear}
        showEntryType
        submitLabel="Apply filters"
      />
    </section>
  )
}
