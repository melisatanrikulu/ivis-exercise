const Backbone = require('backbone')
const cytoscape = require('cytoscape')
const fcose = require('cytoscape-fcose')

cytoscape.use(fcose)

const GraphView = Backbone.View.extend({
  render: function () {
    cytoscape({
      container: this.el,
      elements: this.model.get('elements'),
      layout: {
        name: 'fcose',
      },
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            color: '#111827',
            'text-valign': 'center',
            'text-halign': 'center',
          },
        },
        {
          selector: 'node[type = "Actor"]',
          style: {
            'background-color': '#16a34a',
          },
        },
        {
          selector: 'node[type = "Movie"]',
          style: {
            'background-color': '#2563eb',
          },
        },
        {
          selector: 'edge',
          style: {
            label: 'data(label)',
            width: 2,
            'line-color': '#9ca3af',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#9ca3af',
            'curve-style': 'bezier',
          },
        },
      ],
    })

    return this
  },
})

module.exports = GraphView