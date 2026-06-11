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

  const actorName = req.query.actor || ''
  const depth = Number(req.query.depth || 1)

  try {
    const result = await session.run(`
      MATCH (start:Actor)
      WHERE toLower(start.name) CONTAINS toLower($actorName)
      WITH start
      LIMIT 1

      MATCH path = shortestPath((start)-[:ACTED_IN*0..${depth * 2}]-(neighbor:Actor))
      WHERE length(path) % 2 = 0

      UNWIND relationships(path) AS relationship

      WITH DISTINCT
        CASE
          WHEN startNode(relationship):Actor THEN startNode(relationship)
          ELSE endNode(relationship)
        END AS actor,
        relationship,
        CASE
          WHEN startNode(relationship):Movie THEN startNode(relationship)
          ELSE endNode(relationship)
        END AS movie

      WHERE actor:Actor AND movie:Movie
      RETURN actor, relationship, movie
      LIMIT 500
    `, { actorName })

    const nodes = new Map()
    const edges = []

    result.records.forEach((record) => {
      const actor = record.get('actor')
      const movie = record.get('movie')
      const relationship = record.get('relationship')

      nodes.set(actor.elementId, {
        data: {
          id: actor.elementId,
          label: actor.properties.name || actor.elementId,
          type: 'Actor',
        },
      })

      nodes.set(movie.elementId, {
        data: {
          id: movie.elementId,
          label: movie.properties.title || movie.elementId,
          type: 'Movie',
        },
      })

      edges.push({
        data: {
          id: relationship.elementId,
          source: actor.elementId,
          target: movie.elementId,
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

app.get('/api/actor/:id/movies', async (req, res) => {
  const session = driver.session({
    database: process.env.NEO4J_DATABASE,
  })

  try {
    const result = await session.run(`
      MATCH (actor:Actor)-[relationship:ACTED_IN]->(movie:Movie)
      WHERE elementId(actor) = $actorId
      RETURN actor, relationship, movie
    `, { actorId: req.params.id })

    const nodes = new Map()
    const edges = []

    result.records.forEach((record) => {
      const actor = record.get('actor')
      const movie = record.get('movie')
      const relationship = record.get('relationship')

      nodes.set(actor.elementId, {
        data: {
          id: actor.elementId,
          label: actor.properties.name || actor.elementId,
          type: 'Actor',
        },
      })

      nodes.set(movie.elementId, {
        data: {
          id: movie.elementId,
          label: movie.properties.title || movie.elementId,
          type: 'Movie',
        },
      })

      edges.push({
        data: {
          id: relationship.elementId,
          source: actor.elementId,
          target: movie.elementId,
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

app.get('/api/movie/:id/actors', async (req, res) => {
  const session = driver.session({
    database: process.env.NEO4J_DATABASE,
  })

  try {
    const result = await session.run(`
      MATCH (actor:Actor)-[relationship:ACTED_IN]->(movie:Movie)
      WHERE elementId(movie) = $movieId
      RETURN actor, relationship, movie
    `, { movieId: req.params.id })

    const nodes = new Map()
    const edges = []

    result.records.forEach((record) => {
      const actor = record.get('actor')
      const movie = record.get('movie')
      const relationship = record.get('relationship')

      nodes.set(actor.elementId, {
        data: {
          id: actor.elementId,
          label: actor.properties.name || actor.elementId,
          type: 'Actor',
        },
      })

      nodes.set(movie.elementId, {
        data: {
          id: movie.elementId,
          label: movie.properties.title || movie.elementId,
          type: 'Movie',
        },
      })

      edges.push({
        data: {
          id: relationship.elementId,
          source: actor.elementId,
          target: movie.elementId,
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