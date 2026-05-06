import React from 'react'

export default class ErrorBoundary extends React.Component {
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
      const t = this.props?.t ?? globalThis?.__APP_T__ ?? {}
      return <div className="p-6 text-red-500">{t?.common?.error ?? ''}</div>
    }

    return this.props.children
  }
}
