import { expect } from 'chai'
import {
  required,
  isBetween,
  validateMeasurement,
  patientForm,
  isFormValid
} from '../../src/form.js'

describe('required', () => {
  it('is invalid when undefined', () => {
    expect(required(undefined)).to.eql({ valid: false, message: 'Required' })
  })

  it('is invalid when empty string', () => {
    expect(required('')).to.eql({ valid: false, message: 'Required' })
  })

  it('returns true false value is present', () => {
    expect(required('some value')).to.eql({ valid: true })
  })
})

describe('isBetween', () => {
  it('returns true when value is equal to min', () => {
    expect(isBetween(5, { min: 5, max: 10 })).to.eql({ valid: true })
  })

  it('returns true when value is between min/max', () => {
    expect(isBetween(7, { min: 5, max: 10 })).to.eql({ valid: true })
  })

  it('returns true when value is equal to max', () => {
    expect(isBetween(10, { min: 5, max: 10 })).to.eql({ valid: true })
  })

  it('returns false when value is less than min', () => {
    expect(isBetween(4, { min: 5, max: 10 })).to.eql({ valid: false, message: 'Must be between 5 and 10' })
  })

  it('returns false when value is greater than max', () => {
    expect(isBetween(11, { min: 5, max: 10 })).to.eql({ valid: false, message: 'Must be between 5 and 10' })
  })
})

describe('validateMeasurement', () => {
  it('returns invalid for input', () => {
    const constraints = { min: 10, max: 30 }
    const actual = validateMeasurement(undefined, { constraints, nullable: false })
    expect(actual).to.eql({ valid: false, message: 'Required' })
  })

  it('returns invalid when outside range', () => {
    const constraints = { min: 10, max: 30 }
    const actual = validateMeasurement(40, { constraints, nullable: false })
    expect(actual).to.eql({ valid: false, message: 'Must be between 10 and 30' })
  })


  it('returns valid when value is in range', () => {
    const constraints = { min: 10, max: 30 }
    const actual = validateMeasurement(20, { constraints, nullable: false })
    expect(actual).to.eql({ valid: true })
  })
})

describe('isFormValid', () => {
  it('returns true when name and weight field are valid', () => {
    const form = {
      name: { valid: true },
      weight: { valid: true }
    }

    expect(isFormValid(form)).to.eq(true)
  })

  it('returns false when any field is invalid', () => {
    const form = {
      name: { valid: false },
      weight: { valid: true }
    }

    expect(isFormValid(form)).to.eq(false)
  })
})

describe('patientForm', () => {
  const validPatient = {
    name: 'test patient',
    weight: { value: 100, units: 'kg' }
  }

  it('is valid when form is filled out correctly', () => {
    const form = patientForm(validPatient)
    expect(form.name).to.eql({ valid: true })
    expect(form.weight).to.eql({ valid: true })
  })

  it('is invalid when name is null', () => {
    const form = patientForm({ ...validPatient, name: '' })
    expect(form.name).to.eql({ valid: false, message: 'Required' })
  })

  it('validates weight in imperial', () => {
    const form = patientForm({ 
      ...validPatient, 
      weight: { 
        value: 65, 
        units: 'lb' 
      }
    })

    expect(form.weight).to.eql({ valid: false, message: 'Must be between 66 and 440' })
  })

  it('validates weight in metric', () => {
    const form = patientForm({ 
      ...validPatient, 
      weight: { 
        value: 29, 
        units: 'kg' 
      }
    })

    expect(form.weight).to.eql({ valid: false, message: 'Must be between 30 and 200' })
  })
})
