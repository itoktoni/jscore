import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TableCell from './TableCell.vue'

describe('TableCell', () => {
  it('renders correctly with label and value', () => {
    const wrapper = mount(TableCell, {
      props: {
        label: 'Name',
        value: 'John Doe'
      }
    })

    expect(wrapper.attributes('data-label')).toBe('Name')
    expect(wrapper.text()).toContain('John Doe')
  })

  it('renders empty text when value is null', () => {
    const wrapper = mount(TableCell, {
      props: {
        label: 'Name',
        value: null,
        emptyText: 'Not set'
      }
    })

    expect(wrapper.text()).toContain('Not set')
  })

  it('renders boolean true value with custom label', () => {
    const wrapper = mount(TableCell, {
      props: {
        label: 'Status',
        value: true,
        type: 'boolean',
        booleanLabels: { true: 'Active', false: 'Inactive' }
      }
    })

    expect(wrapper.text()).toContain('Active')
  })

  it('renders username with @ prefix', () => {
    const wrapper = mount(TableCell, {
      props: {
        label: 'Username',
        value: 'johndoe',
        type: 'username'
      }
    })

    expect(wrapper.text()).toContain('@johndoe')
  })

  it('renders price with $ prefix', () => {
    const wrapper = mount(TableCell, {
      props: {
        label: 'Price',
        value: 99.99,
        type: 'price'
      }
    })

    expect(wrapper.text()).toContain('$99.99')
  })

  it('applies correct CSS classes based on type', () => {
    const wrapper = mount(TableCell, {
      props: {
        label: 'Status',
        value: true,
        type: 'status'
      }
    })

    expect(wrapper.classes()).toContain('table-cell--status')
  })

  it('renders slot content when provided', () => {
    const wrapper = mount(TableCell, {
      props: {
        label: 'Custom'
      },
      slots: {
        default: '<span class="custom-content">Custom Content</span>'
      }
    })

    expect(wrapper.find('.custom-content').exists()).toBe(true)
  })
})