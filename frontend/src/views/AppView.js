const Backbone = require('backbone')
const $ = require('jquery')
const GraphView = require('./GraphView')

Backbone.$ = $

const AppView = Backbone.View.extend({
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
    const graphView = new GraphView({
      el: this.$('.graph')[0],
    })

    graphView.render()

    return this
  },
})

module.exports = AppView