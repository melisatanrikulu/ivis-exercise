const Backbone = require('backbone')

const GraphModel = Backbone.Model.extend({
  defaults: function () {
    return {
      elements: [],
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
        this.set('elements', data.elements)
      })
  },

  mergeElements: function (newElements) {
    const existingElements = this.get('elements')
    const elementsById = new Map()

    existingElements.forEach((element) => {
      elementsById.set(element.data.id, element)
    })

    newElements.forEach((element) => {
      elementsById.set(element.data.id, element)
    })

    this.set('elements', Array.from(elementsById.values()))
  },

  loadActorMovies: function (actorId) {
    return fetch(`http://localhost:3001/api/actor/${encodeURIComponent(actorId)}/movies`)
      .then((response) => response.json())
      .then((data) => {
        this.mergeElements(data.elements)
      })
  },

  loadMovieActors: function (movieId) {
    return fetch(`http://localhost:3001/api/movie/${encodeURIComponent(movieId)}/actors`)
      .then((response) => response.json())
      .then((data) => {
        this.mergeElements(data.elements)
      })
  },
})

module.exports = GraphModel