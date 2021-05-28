import { mount } from '@cypress/vue'
import FormValidation from './FormValidation.vue'

describe('FormValidation', () => {
  it('fills out form correctly', () => {
    mount(FormValidation)

    cy.get('[role="name"]').type('lachlan')
    cy.get('[role="weight-units"]').select('lb')
    cy.get('[role="weight"]').type('150')

    cy.get('[role="error"]').should('not.exist')
  })

  it('shows errors for invalid inputs', () => {
    mount(FormValidation)

    cy.get('[role="name"]').clear()
    cy.get('[role="weight-units"]').select('lb')
    cy.get('[role="weight"]').type('50')

    cy.get('[role="error"]').should('have.length', 2)
  })
})
