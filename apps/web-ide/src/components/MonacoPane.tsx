import React, { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'

export function MonacoPane() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const editor = monaco.editor.create(ref.current, {
      value: '// Your code here',
      language: 'typescript',
      theme: 'vs-dark',
      automaticLayout: true,
    })
    return () => editor.dispose()
  }, [])
  return <div ref={ref} style={{ height: 400, border: '1px solid #333' }} />
}
