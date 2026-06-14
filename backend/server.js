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
      WHERE toLower(start.name) = toLower($actorName)
      WITH start
      LIMIT 1

      CALL apoc.path.expandConfig(start, {
        relationshipFilter: "ACTED_IN|<ACTED_IN",
        minLevel: 0,
        maxLevel: $depth * 2,
        bfs: true,
        uniqueness: "NODE_GLOBAL"
      }) YIELD path

      WITH DISTINCT last(nodes(path)) AS node, length(path) AS dist, start
      WHERE
        (node:Actor AND dist % 2 = 0) OR
        (node:Movie AND dist % 2 = 1)

      WITH
        start,
        collect(DISTINCT CASE WHEN node:Actor THEN node END) AS actors,
        collect(DISTINCT CASE WHEN node:Movie THEN node END) AS movies

      UNWIND [a IN actors WHERE a IS NOT NULL] AS actor
      OPTIONAL MATCH (actor)-[relationship:ACTED_IN]->(movie:Movie)
      WHERE movie IN [m IN movies WHERE m IS NOT NULL]

      RETURN DISTINCT actor, relationship, movie
      LIMIT 500
    `, { actorName, depth })

    const nodes = new Map()
    const edges = []

    result.records.forEach((record) => {
      const actor = record.get('actor')
      const movie = record.get('movie')
      const relationship = record.get('relationship')

      if (actor) {
        nodes.set(actor.elementId, {
          data: {
            id: actor.elementId,
            label: actor.properties.name || actor.elementId,
            type: 'Actor',
          },
        })
      }

      if (movie) {
        nodes.set(movie.elementId, {
          data: {
            id: movie.elementId,
            label: movie.properties.title || movie.elementId,
            type: 'Movie',
          },
        })
      }

      if (actor && movie && relationship) {
        edges.push({
          data: {
            id: relationship.elementId,
            source: actor.elementId,
            target: movie.elementId,
            label: relationship.type,
          },
        })
      }
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