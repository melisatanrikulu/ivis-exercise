const Backbone = require('backbone')

const GraphModel = Backbone.Model.extend({
  defaults: function () {
    return {
      elements: [],
    }
  },

  loadGraph: function () {
    return fetch('http://localhost:3001/api/graph')
      .then((response) => response.json())
      .then((data) => {
        this.set('elements', data.elements)
      })
  },
})

module.exports = GraphModel