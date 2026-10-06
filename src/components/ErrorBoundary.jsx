import { Component } from 'react'

// Shows `fallback` (nothing by default) instead of letting an error blank the whole page.
// Used around the 3D background: if WebGL is unavailable or its file fails to load,
// the site still works, just without the 3D.
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('Part of the page failed to load and was skipped:', error)
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}
