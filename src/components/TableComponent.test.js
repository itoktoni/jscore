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
  to: 2,
  totalPages: 1
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

  it('renders status cells correctly', async () => {
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

    // Check that status cells are rendered with correct classes
    const statusCells = wrapper.findAll('.table-cell--status')
    expect(statusCells).toHaveLength(mockItems.length)
  })

  it('renders number cells with sequential numbering', async () => {
    const wrapper = mount(TableComponent, {
      props: {
        items: mockItems,
        pagination: mockPagination,
        selectAll: false,
        columns: [
          { key: 'no', label: 'No.', type: 'number' }
        ],
        entityName: 'users'
      }
    })

    // Check that number cells are rendered with correct values (1, 2)
    const numberCells = wrapper.findAll('.table-cell--number')
    expect(numberCells).toHaveLength(mockItems.length)
    expect(numberCells[0].text()).toContain('1')
    expect(numberCells[1].text()).toContain('2')
  })

  it('hides checkbox column when showCheckbox is false', () => {
    const wrapper = mount(TableComponent, {
      props: {
        items: mockItems,
        pagination: mockPagination,
        columns: mockColumns,
        entityName: 'users',
        showCheckbox: false
      }
    })

    // Check that checkbox column is not rendered
    const checkboxHeaders = wrapper.findAll('thead th input[type="checkbox"]')
    expect(checkboxHeaders).toHaveLength(0)

    const checkboxCells = wrapper.findAll('tbody td input[type="checkbox"]')
    expect(checkboxCells).toHaveLength(0)
  })

  it('hides actions column when showActions is false', () => {
    const wrapper = mount(TableComponent, {
      props: {
        items: mockItems,
        pagination: mockPagination,
        columns: mockColumns,
        entityName: 'users',
        showActions: false
      }
    })

    // Check that actions column is not rendered
    const actionHeaders = wrapper.findAll('thead th.action-header')
    expect(actionHeaders).toHaveLength(0)

    const actionCells = wrapper.findAll('tbody td.column-action')
    expect(actionCells).toHaveLength(0)
  })

  it('hides select all checkbox in info bar when showSelectAll is false', () => {
    const wrapper = mount(TableComponent, {
      props: {
        items: mockItems,
        pagination: mockPagination,
        columns: mockColumns,
        entityName: 'users',
        showSelectAll: false
      }
    })

    // Check that select all checkbox in info bar is not rendered
    const selectAllCheckbox = wrapper.find('.select-all input[type="checkbox"]')
    expect(selectAllCheckbox.exists()).toBe(false)
  })

  it('renders manual header when header slot is provided', () => {
    const wrapper = mount(TableComponent, {
      props: {
        items: mockItems,
        pagination: mockPagination,
        columns: mockColumns,
        entityName: 'users'
      },
      slots: {
        header: '<th>Custom Header 1</th><th>Custom Header 2</th>'
      }
    })

    // Check that custom headers are rendered
    const customHeaders = wrapper.findAll('thead th')
    // Should have 2 default columns (checkbox and actions) plus 2 custom headers
    expect(customHeaders).toHaveLength(4)
    expect(customHeaders[2].text()).toBe('Custom Header 1')
    expect(customHeaders[3].text()).toBe('Custom Header 2')
  })
})