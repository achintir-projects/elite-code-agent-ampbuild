import React from 'react'

export function LogsPane({ logs }: { logs: string[] }) {
  return (
    <div style={{ padding: 12, borderLeft: '1px solid #333', overflow: 'auto' }}>
      <h3>Logs</h3>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{logs.join('\n\n')}</pre>
    </div>
  )
}
