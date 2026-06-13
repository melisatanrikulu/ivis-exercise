const Backbone = require('backbone')
const cytoscape = require('cytoscape')
const fcose = require('cytoscape-fcose')
const contextMenus = require('cytoscape-context-menus')

cytoscape.use(fcose)
contextMenus(cytoscape)

const GraphView = Backbone.View.extend({
  initialize: function () {
    this.listenTo(this.model, 'change:elements', this.updateGraph)
    this.listenTo(this.model, 'applyLayout', this.applyLayout)
  },
  updateGraph: function () {
    const updateMode = this.model.get('updateMode')

    if (updateMode === 'replace' || !this.cy) {
      this.render()
      return
    }

    const elements = this.model.get('elements')

    elements.forEach((element) => {
      if (!this.cy.getElementById(element.data.id).length) {
        this.cy.add(element)
      }
    })

    const fcoseOptions = this.model.get('fcoseOptions') || {}

    this.cy.layout({
      name: 'fcose',
      ...fcoseOptions,
    }).run()
  },
  applyLayout: function () {
    if (!this.cy) {
      return
    }

    const fcoseOptions = this.model.get('fcoseOptions') || {}

    this.cy.layout({
      name: 'fcose',
      ...fcoseOptions,
    }).run()
  },
  render: function () {
    if (this.cy) {
      this.cy.destroy()
    }

    const fcoseOptions = this.model.get('fcoseOptions') || {}

    this.cy = cytoscape({
      container: this.el,
      elements: this.model.get('elements'),
      layout: {
        name: 'fcose',
        ...fcoseOptions,
        randomize: true,
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
            console.log('Show movies clicked', node && node.id(), node && node.data('label'))
            this.model.loadActorMovies(node.id())
          },
        },
        {
          id: 'show-actors',
          content: 'Show actors',
          selector: 'node[type = "Movie"]',
          onClickFunction: (event) => {
            const node = event.target || event.cyTarget
            console.log('Show actors clicked', node && node.id(), node && node.data('label'))
            this.model.loadMovieActors(node.id())
          },
        },
      ],
    })

    return this
  },
})

module.exports = GraphView