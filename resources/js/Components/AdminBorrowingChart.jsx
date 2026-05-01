import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function AdminBorrowingChart({ data = [] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="borrowingsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip
            cursor={{ stroke: '#38bdf8', strokeDasharray: '4 4' }}
            contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 12px 30px rgba(15,23,42,.08)' }}
          />
          <Area type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={3} fill="url(#borrowingsFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
