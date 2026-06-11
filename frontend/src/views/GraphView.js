const Backbone = require('backbone')
const cytoscape = require('cytoscape')
const fcose = require('cytoscape-fcose')
const contextMenus = require('cytoscape-context-menus')

cytoscape.use(fcose)
contextMenus(cytoscape)

const GraphView = Backbone.View.extend({
  initialize: function () {
    this.listenTo(this.model, 'change:elements', this.render)
  },
  render: function () {
    if (this.cy) {
      this.cy.destroy()
    }
    this.cy = cytoscape({
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
            'font-size': 10,
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
            'font-size': 8,
            width: 2,
            'line-color': '#9ca3af',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#9ca3af',
            'curve-style': 'bezier',
          },
        },
      ],
    })

    this.cy.contextMenus({
      menuItems: [
        {
          id: 'show-movies',
          content: 'Show movies',
          selector: 'node[type = "Actor"]',
          onClickFunction: (event) => {
            const node = event.target || event.cyTarget
            this.model.loadActorMovies(node.id())
          },
        },
        {
          id: 'show-actors',
          content: 'Show actors',
          selector: 'node[type = "Movie"]',
          onClickFunction: (event) => {
            const node = event.target || event.cyTarget
            this.model.loadMovieActors(node.id())
          },
        },
      ],
    })

    return this
  },
})

module.exports = GraphView