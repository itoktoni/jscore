import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import TableComponent from './TableComponent.vue'

// Mock data
const mockItems = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    active: true,
    selected: false
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    active: false,
    selected: false
  }
]

const mockPagination = {
  currentPage: 1,
  perPage: 10,
  total: 2,
  from: 1,
  to: 2
}

const mockColumns = [
  { key: 'no', label: 'No.', type: 'number' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'active', label: 'Status', type: 'status' }
]

describe('TableComponent', () => {
  it('renders correctly with items', () => {
    const wrapper = mount(TableComponent, {
      props: {
        items: mockItems,
        pagination: mockPagination,
        selectAll: false,
        columns: mockColumns,
        entityName: 'users'
      }
    })

    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr')).toHaveLength(mockItems.length)
  })

  it('displays correct pagination info', () => {
    const wrapper = mount(TableComponent, {
      props: {
        items: mockItems,
        pagination: mockPagination,
        selectAll: false,
        columns: mockColumns,
        entityName: 'users'
      }
    })

    expect(wrapper.text()).toContain('Showing 1 to 2 of 2 users')
  })

  it('emits toggle-select-all event when select all checkbox is clicked', async () => {
    const wrapper = mount(TableComponent, {
      props: {
        items: mockItems,
        pagination: mockPagination,
        selectAll: false,
        columns: mockColumns,
        entityName: 'users'
      }
    })

    const selectAllCheckbox = wrapper.find('thead input[type="checkbox"]')
    await selectAllCheckbox.trigger('change')

    expect(wrapper.emitted('toggle-select-all')).toBeTruthy()
  })

  it('emits update-select-all event when row checkbox is clicked', async () => {
    const wrapper = mount(TableComponent, {
      props: {
        items: mockItems,
        pagination: mockPagination,
        selectAll: false,
        columns: mockColumns,
        entityName: 'users'
      }
    })

    const rowCheckbox = wrapper.find('tbody input[type="checkbox"]')
    await rowCheckbox.trigger('change')

    expect(wrapper.emitted('update-select-all')).toBeTruthy()
  })

  it('renders actions slot correctly', () => {
    const wrapper = mount(TableComponent, {
      props: {
        items: mockItems,
        pagination: mockPagination,
        selectAll: false,
        columns: mockColumns,
        entityName: 'users'
      },
      slots: {
        actions: '<button class="custom-action">Custom Action</button>'
      }
    })

    // Check that the custom action button is rendered for each item
    const actionButtons = wrapper.findAll('.custom-action')
    expect(actionButtons).toHaveLength(mockItems.length)
  })

  it('renders custom slots correctly', async () => {
    const wrapper = mount(TableComponent, {
      props: {
        items: mockItems,
        pagination: mockPagination,
        selectAll: false,
        columns: [
          { key: 'name', label: 'Name', type: 'custom' }
        ],
        entityName: 'users'
      },
      slots: {
        name: '<div class="custom-name">Custom Name Slot</div>'
      }
    })

    expect(wrapper.find('.custom-name').exists()).toBe(true)
  })

  it('displays status correctly', async () => {
    const wrapper = mount(TableComponent, {
      props: {
        items: mockItems,
        pagination: mockPagination,
        selectAll: false,
        columns: [
          { key: 'active', label: 'Status', type: 'status' }
        ],
        entityName: 'users'
      }
    })

    const statusElements = wrapper.findAll('.status-active, .status-inactive')
    expect(statusElements).toHaveLength(mockItems.length)
  })
})