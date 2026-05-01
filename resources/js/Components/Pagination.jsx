import { Link } from '@inertiajs/react'

function decodeLabel(label) {
  return label
    .replaceAll('&laquo;', '«')
    .replaceAll('&raquo;', '»')
    .replaceAll('&amp;', '&')
  }

export default function Pagination({ links = [] }) {
  if (links.length <= 3) {
    return null
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
      {links.map((link, index) => {
        const label = decodeLabel(link.label)
        const className = link.active
          ? 'border-sky-500 bg-sky-500 text-white'
          : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700'

        if (!link.url) {
          return (
            <span
              key={`${label}-${index}`}
              className="inline-flex min-w-10 cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-400"
            >
              {label}
            </span>
          )
        }

        return (
          <Link
            key={`${label}-${index}`}
            href={link.url}
            preserveState
            replace
            className={`inline-flex min-w-10 items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium transition ${className}`}
          >
            <span dangerouslySetInnerHTML={{ __html: label }} />
          </Link>
        )
      })}
    </div>
  )
}
