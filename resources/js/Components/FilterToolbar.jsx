export default function FilterToolbar({ children, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      <div className="flex items-center justify-end gap-2">{actions}</div>
    </div>
  )
}
