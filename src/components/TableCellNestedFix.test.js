import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TableCell from './TableCell.vue'

describe('TableCell Nested Fix', () => {
  it('renders td element when isChild is false (standalone usage)', () => {
    const wrapper = mount(TableCell, {
      props: {
        label: 'Name',
        value: 'John Doe',
        isChild: false
      }
    })

    // Should render a td element when used standalone
    expect(wrapper.find('td').exists()).toBe(true)
    expect(wrapper.find('td').attributes('data-label')).toBe('Name')
    expect(wrapper.text()).toContain('John Doe')
  })

  it('renders div element when isChild is true (used within TableComponent)', () => {
    const wrapper = mount(TableCell, {
      props: {
        label: 'Name',
        value: 'John Doe',
        isChild: true
      }
    })

    // Should render a div element when used within TableComponent
    expect(wrapper.find('td').exists()).toBe(false)
    expect(wrapper.find('div.table-cell__content').exists()).toBe(true)
    expect(wrapper.text()).toContain('John Doe')
  })

  it('renders empty text when value is null', () => {
    const wrapper = mount(TableCell, {
      props: {
        label: 'Name',
        value: null,
        emptyText: 'N/A',
        isChild: false
      }
    })

    expect(wrapper.text()).toContain('N/A')
  })

  it('renders boolean true value with custom label', () => {
    const wrapper = mount(TableCell, {
      props: {
        label: 'Status',
        value: true,
        type: 'boolean',
        booleanLabels: { true: 'Active', false: 'Inactive' },
        isChild: false
      }
    })

    expect(wrapper.text()).toContain('Active')
  })

  it('renders username with @ prefix', () => {
    const wrapper = mount(TableCell, {
      props: {
        label: 'Username',
        value: 'johndoe',
        type: 'username',
        isChild: false
      }
    })

    expect(wrapper.text()).toContain('@johndoe')
  })

  it('renders price with $ prefix', () => {
    const wrapper = mount(TableCell, {
      props: {
        label: 'Price',
        value: 99.99,
        type: 'price',
        isChild: false
      }
    })

    expect(wrapper.text()).toContain('$99.99')
  })
})