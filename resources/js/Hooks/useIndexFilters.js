import { router, useForm } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'

function compactQuery(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  )
}

export default function useIndexFilters({ url, defaults, filters = {}, debounceKeys = ['search'] }) {
  const serializedDefaults = JSON.stringify(defaults)
  const serializedFilters = JSON.stringify(filters)
  const normalizedFilters = useMemo(() => ({ ...defaults, ...filters }), [serializedDefaults, serializedFilters])
  const defaultValues = useMemo(() => ({ ...defaults }), [serializedDefaults])
  const form = useForm(normalizedFilters)
  const [isLoading, setIsLoading] = useState(false)
  const debounceSnapshot = JSON.stringify(
    debounceKeys.reduce((accumulator, key) => {
      accumulator[key] = normalizedFilters[key]
      return accumulator
    }, {})
  )
  const currentDebounceSnapshot = JSON.stringify(
    debounceKeys.reduce((accumulator, key) => {
      accumulator[key] = form.data[key]
      return accumulator
    }, {})
  )

  useEffect(() => {
    form.setData(normalizedFilters)
  }, [normalizedFilters])

  const applyFilters = (nextData = form.data) => {
    setIsLoading(true)

    router.get(url, compactQuery(nextData), {
      preserveState: true,
      replace: true,
      onFinish: () => setIsLoading(false),
    })
  }

  const resetFilters = () => {
    form.setData(defaultValues)
    applyFilters(defaultValues)
  }

  useEffect(() => {
    const keys = debounceKeys.filter(Boolean)

    if (keys.length === 0) {
      return undefined
    }

    const delay = setTimeout(() => {
      const hasChanged = keys.some((key) => form.data[key] !== normalizedFilters[key])

      if (hasChanged) {
        applyFilters()
      }
    }, 500)

    return () => clearTimeout(delay)
  }, [currentDebounceSnapshot, debounceSnapshot])

  return {
    ...form,
    isLoading,
    applyFilters,
    resetFilters,
  }
}
