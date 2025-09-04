'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>Ein Fehler ist aufgetreten</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error?.message}</pre>
      <button onClick={reset}>Erneut versuchen</button>
    </div>
  )
}
