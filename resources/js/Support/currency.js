export function formatCurrency(amount, currency = 'IDR') {
  const value = Number(amount ?? 0)
  const code = currency || 'IDR'
  const locale = code === 'IDR' ? 'id-ID' : 'en-US'

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    maximumFractionDigits: 0,
  }).format(value)

  if (code === 'IDR') {
    return formatted.replace('Rp', 'Rp ')
  }

  return formatted
}
