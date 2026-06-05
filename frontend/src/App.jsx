import { useEffect, useRef, useState } from 'react'
import './App.css'
import cytoscape from 'cytoscape'
import fcose from 'cytoscape-fcose'

cytoscape.use(fcose)

function App() {
  const graphRef = useRef(null)
  const [searchText, setSearchText] = useState('')
  
  useEffect(() => {
    if (!graphRef.current) return

    let cy

    async function loadGraph() {
      const response = await fetch('http://localhost:3001/api/graph')
      const data = await response.json()

      cy = cytoscape({
        container: graphRef.current,
        elements: data.elements,
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
            selector: 'node[type = "Movie"]',
            style: {
              'background-color': '#2563eb',
            },
          },
          {
            selector: 'node[type = "Actor"]',
            style: {
              'background-color': '#16a34a',
            },
          },
          {
            selector: 'node[type = "Director"]',
            style: {
              'background-color': '#dc2626',
            },
          },
          {
            selector: 'node[type = "Genre"]',
            style: {
              'background-color': '#f59e0b',
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
    }

    loadGraph()

    return () => {
      if (cy) {
        cy.destroy()
      }
    }
  }, [])

  return (
    <main>
      <div className="toolbar">
        <input
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search movie..."
        />
      </div>

      <div
        ref={graphRef}
        className="graph"
      />
    </main>
  )
}

export default App
