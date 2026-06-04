import { useEffect, useRef } from 'react'
import './App.css'
import cytoscape from 'cytoscape'
import fcose from 'cytoscape-fcose'

cytoscape.use(fcose)

function App() {
  const graphRef = useRef(null)
  
  useEffect(() => {
    if (!graphRef.current) return

    const cy = cytoscape({
      container: graphRef.current,
      elements: [
        { data: { id: 'movie', label: 'Movie' } },
        { data: { id: 'actor', label: 'Actor' } },
        { data: { id: 'director', label: 'Director' } },
        { data: { source: 'actor', target: 'movie', label: 'ACTED_IN' } },
        { data: { source: 'director', target: 'movie', label: 'DIRECTED' } },
      ],
      layout: {
        name: 'fcose',
      },
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'background-color': '#4f46e5',
            color: '#111827',
            'text-valign': 'center',
            'text-halign': 'center',
          },
        },
        {
          selector: 'edge',
          style: {
            label: 'data(label)',
            width: 2,
            'line-color': '#9ca3af',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#9ca3af',
            'curve-style': 'bezier',
          },
        },
      ],
    })

    return () => {
      cy.destroy()
    }
  }, [])

  return (
    <main>
      <div
        ref={graphRef}
        style={{
          width: '100%',
          height: '100vh',
          border: '1px solid #ccc',
        }}
      />
    </main>
  )
}

export default App
