import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import FieldCell from './FieldCell.vue'

describe('FieldCell', () => {
  it('renders text value correctly', () => {
    const wrapper = mount(FieldCell, {
      props: {
        value: 'John Doe'
      }
    })

    expect(wrapper.text()).toContain('John Doe')
  })

  it('renders number value correctly', () => {
    const wrapper = mount(FieldCell, {
      props: {
        value: 42,
        fieldType: 'number'
      }
    })

    expect(wrapper.text()).toContain('42')
  })

  it('shows empty text when value is null', () => {
    const wrapper = mount(FieldCell, {
      props: {
        value: null,
        emptyText: 'Not set'
      }
    })

    expect(wrapper.text()).toContain('Not set')
  })

  it('shows empty text when value is undefined', () => {
    const wrapper = mount(FieldCell, {
      props: {
        value: undefined,
        emptyText: 'Not set'
      }
    })

    expect(wrapper.text()).toContain('Not set')
  })

  it('shows empty text when value is empty string', () => {
    const wrapper = mount(FieldCell, {
      props: {
        value: '',
        emptyText: 'Not set'
      }
    })

    expect(wrapper.text()).toContain('Not set')
  })

  it('renders boolean true value with custom label', () => {
    const wrapper = mount(FieldCell, {
      props: {
        value: true,
        fieldType: 'boolean',
        booleanLabels: { true: 'Active', false: 'Inactive' }
      }
    })

    expect(wrapper.text()).toContain('Active')
  })

  it('renders boolean false value with custom label', () => {
    const wrapper = mount(FieldCell, {
      props: {
        value: false,
        fieldType: 'boolean',
        booleanLabels: { true: 'Active', false: 'Inactive' }
      }
    })

    expect(wrapper.text()).toContain('Inactive')
  })

  it('renders username with @ prefix', () => {
    const wrapper = mount(FieldCell, {
      props: {
        value: 'johndoe',
        fieldType: 'username'
      }
    })

    expect(wrapper.text()).toContain('@johndoe')
  })

  it('renders price with $ prefix', () => {
    const wrapper = mount(FieldCell, {
      props: {
        value: 99.99,
        fieldType: 'price'
      }
    })

    expect(wrapper.text()).toContain('$99.99')
  })

  it('renders status active with correct styling', () => {
    const wrapper = mount(FieldCell, {
      props: {
        value: true,
        fieldType: 'status',
        booleanLabels: { true: 'Active', false: 'Inactive' }
      }
    })

    expect(wrapper.text()).toContain('Active')
    expect(wrapper.classes()).toContain('field-cell--status')
  })

  it('renders status inactive with correct styling', () => {
    const wrapper = mount(FieldCell, {
      props: {
        value: false,
        fieldType: 'status',
        booleanLabels: { true: 'Active', false: 'Inactive' }
      }
    })

    expect(wrapper.text()).toContain('Inactive')
    expect(wrapper.classes()).toContain('field-cell--status')
  })

  it('applies prefix and suffix correctly', () => {
    const wrapper = mount(FieldCell, {
      props: {
        value: 'example',
        prefix: '[',
        suffix: ']'
      }
    })

    expect(wrapper.text()).toContain('[example]')
  })

  it('uses default boolean labels when not provided', () => {
    const wrapper = mount(FieldCell, {
      props: {
        value: true,
        fieldType: 'boolean'
      }
    })

    expect(wrapper.text()).toContain('Yes')
  })
})