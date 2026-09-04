import { CATEGORIES, DISTRICTS, ENTRY_TYPES } from '../data/places'

export default function SearchBar({
  values,
  onChange,
  onSubmit,
  onClear,
  error,
  showEntryType = false,
  submitLabel = 'Search',
  compact = false,
}) {
  const fieldClass =
    'w-full rounded-xl border border-jungle/15 bg-white px-3 py-3 text-sm text-ink outline-none ring-gold/40 transition focus:ring-2'

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className={`grid gap-3 ${compact ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            Destination
          </span>
          <input
            type="text"
            name="search"
            value={values.search}
            onChange={(event) => onChange({ ...values, search: event.target.value })}
            placeholder="Search Ella, Sigiriya, beach..."
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            District
          </span>
          <select
            name="district"
            value={values.district}
            onChange={(event) => onChange({ ...values, district: event.target.value })}
            className={fieldClass}
          >
            <option value="">All districts</option>
            {DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            Category
          </span>
          <select
            name="category"
            value={values.category}
            onChange={(event) => onChange({ ...values, category: event.target.value })}
            className={fieldClass}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        {showEntryType ? (
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              Entry type
            </span>
            <select
              name="entryType"
              value={values.entryType}
              onChange={(event) => onChange({ ...values, entryType: event.target.value })}
              className={fieldClass}
            >
              <option value="">Free or paid</option>
              {ENTRY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-jungle-deep transition hover:bg-[#d4b56c]"
            >
              {submitLabel}
            </button>
          </div>
        )}
      </div>

      {showEntryType ? (
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="w-full rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-jungle-deep transition hover:bg-[#d4b56c] sm:w-auto sm:min-w-40"
          >
            {submitLabel}
          </button>
          {onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="w-full rounded-xl border border-jungle/20 bg-white px-4 py-3 text-sm font-semibold text-jungle sm:w-auto sm:min-w-40"
            >
              Clear Filters
            </button>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  )
}
