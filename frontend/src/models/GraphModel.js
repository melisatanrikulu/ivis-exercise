const Backbone = require('backbone')

const GraphModel = Backbone.Model.extend({
  defaults: function () {
    return {
      elements: [
        { data: { id: 'actor', label: 'Actor', type: 'Actor' } },
        { data: { id: 'movie', label: 'Movie', type: 'Movie' } },
        { data: { source: 'actor', target: 'movie', label: 'ACTED_IN' } },
      ],
    }
  },
})

module.exports = GraphModel