const Backbone = require('backbone')
const $ = require('jquery')
const GraphView = require('./GraphView')
const GraphModel = require('../models/GraphModel')

Backbone.$ = $

const AppView = Backbone.View.extend({
  events: {
    'click .load-graph': 'onLoadGraph',
  },

  onLoadGraph: function () {
    const actorName = this.$('.actor-name').val()
    const depth = this.$('.actor-depth').val()

    this.graphModel.loadGraph(actorName, depth)
  },
  
  render: function () {
    this.$el.html(`
      <div class="app">
        <div class="toolbar">
          <input class="actor-name" type="text" placeholder="Actor name">
          <input class="actor-depth" type="number" min="1" value="1">
          <button class="load-graph">Load graph</button>
        </div>
        <div class="graph"></div>
      </div>
    `)
    this.graphModel = new GraphModel()

    const graphView = new GraphView({
      el: this.$('.graph')[0],
      model: this.graphModel,
    })

    graphView.render()
    this.graphModel.loadGraph('', 1)

    return this
  },
})

module.exports = AppView