'use client'

import React from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
          <h2>Ein Fehler ist aufgetreten</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error?.message}</pre>
          <button onClick={() => reset()}>Erneut versuchen</button>
        </div>
      </body>
    </html>
  )
}
