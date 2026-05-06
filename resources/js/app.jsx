import '../css/app.css'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from './Components/ErrorBoundary'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`].default
  },
  setup({ el, App, props }) {
    globalThis.__APP_T__ = props?.initialPage?.props?.t ?? {}
    createRoot(el).render(
      <ErrorBoundary>
        <App {...props} />
      </ErrorBoundary>,
    )
  },
})
