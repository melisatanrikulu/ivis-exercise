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
})

module.exports = GraphModel