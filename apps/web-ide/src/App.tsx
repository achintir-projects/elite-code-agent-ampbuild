import React, { useState } from 'react'
import { MonacoPane } from './components/MonacoPane'
import { LogsPane } from './components/LogsPane'

export function App() {
  const [goal, setGoal] = useState('Build a Rust CLI that prints Hello')
  const [logs, setLogs] = useState<string[]>([])

  async function run() {
    const res = await fetch('/api/agent/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, cwd: '.' })
    })
    const json = await res.json()
    setLogs((l) => [...l, JSON.stringify(json)])
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100vh' }}>
      <div style={{ padding: 12 }}>
        <h1>Elite Web IDE</h1>
        <textarea value={goal} onChange={(e) => setGoal(e.target.value)} style={{ width: '100%', height: 120 }} />
        <div>
          <button onClick={run}>Run Agent</button>
        </div>
        <MonacoPane />
      </div>
      <LogsPane logs={logs} />
    </div>
  )
}
