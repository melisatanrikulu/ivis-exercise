const Backbone = require('backbone')

const GraphModel = Backbone.Model.extend({
  defaults: function () {
    return {
      elements: [],
      fcoseOptions: {
        nodeRepulsion: 4500,
        idealEdgeLength: 50,
        gravity: 0.25,
        fit: true,
        randomize: false,
        padding: 30,
      },
    }
  },

  loadGraph: function (actorName, depth) {
    const query = new URLSearchParams({
      actor: actorName,
      depth: depth,
    })

    return fetch(`http://localhost:3001/api/graph?${query.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        this.set({
          elements: data.elements,
          updateMode: 'replace',
        })
      })
  },

  mergeElements: function (newElements) {
    const existingElements = this.get('elements')
    console.log('Merge before:', existingElements.length)
    const elementsById = new Map()

    existingElements.forEach((element) => {
      elementsById.set(element.data.id, element)
    })

    newElements.forEach((element) => {
      elementsById.set(element.data.id, element)
    })
    console.log('Merge after:', elementsById.size)
    this.set({
      elements: Array.from(elementsById.values()),
      updateMode: 'expand',
    })
  },

  loadActorMovies: function (actorId) {
    return fetch(`http://localhost:3001/api/actor/${encodeURIComponent(actorId)}/movies`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Actor movies returned', data.elements.length)
        this.mergeElements(data.elements)
      })
  },

  loadMovieActors: function (movieId) {
    return fetch(`http://localhost:3001/api/movie/${encodeURIComponent(movieId)}/actors`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Movie actors returned', data.elements.length)
        this.mergeElements(data.elements)
      })
  },
})

module.exports = GraphModel