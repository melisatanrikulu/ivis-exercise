const Backbone = require('backbone')
const $ = require('jquery')
const GraphView = require('./GraphView')
const GraphModel = require('../models/GraphModel')

Backbone.$ = $

const AppView = Backbone.View.extend({
  events: {
    'click .load-graph': 'onLoadGraph',
    'click .apply-layout': 'onApplyLayout',
  },

  onLoadGraph: function () {
    const actorName = this.$('.actor-name').val()
    const depth = this.$('.actor-depth').val()

    this.graphModel.loadGraph(actorName, depth)
  },

  onApplyLayout: function () {
    this.graphModel.set('fcoseOptions', {
      nodeRepulsion: Number(this.$('.fcose-node-repulsion').val()),
      idealEdgeLength: Number(this.$('.fcose-ideal-edge-length').val()),
      gravity: Number(this.$('.fcose-gravity').val()),
      padding: Number(this.$('.fcose-padding').val()),
    })

    this.graphModel.trigger('applyLayout')
  },
  
  render: function () {
    this.graphModel = new GraphModel()
    const fcoseOptions = this.graphModel.get('fcoseOptions')

    this.$el.html(`
      <div class="app">
        <div class="toolbar">
          <input class="actor-name" type="text" placeholder="Actor name">
          <input class="actor-depth" type="number" min="0" value="1">
          <button class="load-graph">Load graph</button>
        </div>
        <div class="content">
        <div class="layout-panel">
          <h3>Layout Settings</h3>

          <label>
            Node Repulsion
            <input class="fcose-node-repulsion" type="number" min="0" value="${fcoseOptions.nodeRepulsion}">
          </label>

          <label>
            Ideal Edge Length
            <input class="fcose-ideal-edge-length" type="number" min="0" value="${fcoseOptions.idealEdgeLength}">
          </label>

          <label>
            Gravity
            <input class="fcose-gravity" type="number" min="0" step="0.1" value="${fcoseOptions.gravity}">
          </label>

          <label>
            Padding
            <input class="fcose-padding" type="number" min="0" value="${fcoseOptions.padding}">
          </label>

          <button class="apply-layout">Apply Layout</button>
        </div>

        <div class="graph"></div>
      </div>
      </div>
    `)

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