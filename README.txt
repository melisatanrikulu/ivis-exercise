i-Vis Engineer Exercise

This repository contains a small movie-exploration web application built for the i-Vis Engineer Exercise. It uses a Neo4j movie graph in the backend and Cytoscape.js in the frontend to visualize actors, movies, and their relationships.

What the app does

- Lets the user query the neighborhood of an actor by entering an actor name and an actor-number depth.
- Displays the resulting subgraph with Cytoscape.js.
- Uses the fCoSE layout extension to automatically arrange the graph.
- Supports context-menu based graph expansion:
  - Right click an actor node to show that actor's movies.
  - Right click a movie node to show the actors in that movie.
- Applies incremental layout when the graph is extended.
- Exposes a few layout controls in the UI:
  - node repulsion
  - ideal edge length
  - gravity
  - padding

Current UI behavior

- The app loads an initial graph for Tom Hardy with depth 1.
- Actor nodes and movie nodes are styled differently and show their names as labels.

Project structure

- `backend/`: Express server and Neo4j queries
- `frontend/`: Backbone-based UI, Cytoscape graph view, and browser build setup

Tech stack

- Backend: Node.js, Express, neo4j-driver, dotenv, cors
- Frontend: Backbone, jQuery, Cytoscape.js, cytoscape-fcose, cytoscape-context-menus
- Build tools: browserify, watchify, http-server

Prerequisites

- Node.js 18+ recommended
- npm
- A running Neo4j instance
- The Neo4j movie dataset described in the exercise brief

Neo4j configuration

The backend reads its connection settings from `backend/.env`.

An example file is provided at `backend/.env-example`.

Example local configuration:

`NEO4J_URI=bolt://localhost:7687`
`NEO4J_USERNAME=neo4j`
`NEO4J_PASSWORD=your_password`
`NEO4J_DATABASE=neo4j`

The example file also includes the demo credentials used for the Neo4j recommendations dataset.

Installation

1. Install backend dependencies:
   `cd backend`
   `npm install`
2. Install frontend dependencies:
   `cd ../frontend`
   `npm install`
3. Create `backend/.env` using `backend/.env-example` and fill in valid Neo4j credentials.

Running the application

1. Start the backend:
   `cd backend`
   `npm start`

   The backend runs at `http://localhost:3001`.

2. Build the frontend bundle:
   `cd frontend`
   `npm run build`

3. Serve the frontend:
   `npm run serve`

   The frontend is served at `http://localhost:8080`.

Optional development workflow

- Rebuild automatically while editing frontend files:
  `cd frontend`
  `npm run watch`

Backend API

- `GET /`
  Health check
- `GET /api/neo4j-test`
  Tests Neo4j connectivity
- `GET /api/graph?actor=<name>&depth=<n>`
  Loads the actor-centered graph
- `GET /api/actor/:id/movies`
  Expands an actor with all movies they acted in
- `GET /api/movie/:id/actors`
  Expands a movie with all of its actors

Notes

- The graph query is centered on actors and uses the requested depth to expand through actor-movie relationships.
- Context-menu expansions merge newly fetched elements into the current graph rather than replacing it.
- The frontend expects the backend on port `3001` and the static frontend on port `8080`.

Submission note

This README includes the deployment guide requested in the exercise brief so the project can be built and tested locally.
