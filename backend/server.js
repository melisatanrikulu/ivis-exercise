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

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`)
})