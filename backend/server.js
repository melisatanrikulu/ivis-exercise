require('dotenv').config()

const express = require('express')
const cors = require('cors')
const neo4j = require('neo4j-driver')

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME,
    process.env.NEO4J_PASSWORD
  )
)

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running' })
})

app.get('/api/neo4j-test', async (req, res) => {
  const session = driver.session({
    database: process.env.NEO4J_DATABASE,
  })

  try {
    const result = await session.run('RETURN 1 AS ok')
    const ok = result.records[0].get('ok').toNumber()

    res.json({
      connected: true,
      result: ok,
    })
  } catch (error) {
    res.status(500).json({
      connected: false,
      error: error.message,
    })
  } finally {
    await session.close()
  }
})

app.get('/api/graph', async (req, res) => {
  const session = driver.session({
    database: process.env.NEO4J_DATABASE,
  })

  try {
    const result = await session.run(`
      MATCH (source)-[relationship]->(target)
      WHERE source:Movie OR source:Actor OR source:Director OR source:Genre
      RETURN source, relationship, target
      LIMIT 25
    `)

    const nodes = new Map()
    const edges = []

    result.records.forEach((record) => {
      const source = record.get('source')
      const target = record.get('target')
      const relationship = record.get('relationship')

      nodes.set(source.elementId, {
        data: {
          id: source.elementId,
          label: source.properties.title || source.properties.name || source.elementId,
          type: source.labels[0],
        },
      })

      nodes.set(target.elementId, {
        data: {
          id: target.elementId,
          label: target.properties.title || target.properties.name || target.elementId,
          type: target.labels[0],
        },
      })

      edges.push({
        data: {
          id: relationship.elementId,
          source: source.elementId,
          target: target.elementId,
          label: relationship.type,
        },
      })
    })

    res.json({
      elements: [...nodes.values(), ...edges],
    })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  } finally {
    await session.close()
  }
})

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`)
})