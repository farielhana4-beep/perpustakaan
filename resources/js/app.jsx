import '../css/app.css'
import { createInertiaApp } from '@inertiajs/react'
import { Component } from 'react'
import { createRoot } from 'react-dom/client'

function ErrorFallback() {
  return <div className="p-10 text-red-500">Something broke</div>
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('ErrorBoundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }

    return this.props.children
  }
}

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`].default
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <ErrorBoundary>
        <App {...props} />
      </ErrorBoundary>
    )
  },
})
