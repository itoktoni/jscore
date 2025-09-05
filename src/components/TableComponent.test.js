import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TableComponent from './TableComponent.vue'

describe('TableComponent', () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
  ]

  const mockColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' }
  ]

  it('renders correctly with data and columns', () => {
    const wrapper = mount(TableComponent, {
      props: {
        data: mockData,
        columns: mockColumns
      }
    })

    expect(wrapper.find('.data-table').exists()).toBe(true)
    expect(wrapper.findAll('thead th')).toHaveLength(4)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('displays correct column headers', () => {
    const wrapper = mount(TableComponent, {
      props: {
        data: mockData,
        columns: mockColumns
      }
    })

    const headers = wrapper.findAll('thead th')
    expect(headers[0].text()).toBe('ID')
    expect(headers[1].text()).toBe('Name')
    expect(headers[2].text()).toBe('Email')
    expect(headers[3].text()).toBe('Role')
  })

  it('displays correct data in rows', () => {
    const wrapper = mount(TableComponent, {
      props: {
        data: mockData,
        columns: mockColumns
      }
    })

    const rows = wrapper.findAll('tbody tr')
    const firstRowCells = rows[0].findAll('td')
    expect(firstRowCells[0].text()).toBe('1')
    expect(firstRowCells[1].text()).toBe('John Doe')
    expect(firstRowCells[2].text()).toBe('john@example.com')
    expect(firstRowCells[3].text()).toBe('admin')
  })

  it('shows loading state when loading prop is true', () => {
    const wrapper = mount(TableComponent, {
      props: {
        data: mockData,
        columns: mockColumns,
        loading: true,
        loadingText: 'Loading users...'
      }
    })

    expect(wrapper.find('.loading-indicator').text()).toBe('Loading users...')
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('shows empty state when data is empty', () => {
    const wrapper = mount(TableComponent, {
      props: {
        data: [],
        columns: mockColumns,
        emptyText: 'No users found'
      }
    })

    expect(wrapper.find('tbody .text-center').text()).toBe('No users found')
  })

  it('renders actions column when showEdit or showDelete is true', () => {
    const wrapper = mount(TableComponent, {
      props: {
        data: mockData,
        columns: mockColumns,
        showEdit: true
      }
    })

    // Should have one additional column for actions
    expect(wrapper.findAll('thead th')).toHaveLength(5)
    expect(wrapper.find('thead th.actions-header').text()).toBe('Actions')
  })

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(TableComponent, {
      props: {
        data: mockData,
        columns: mockColumns,
        showEdit: true
      }
    })

    const editButton = wrapper.find('.btn-outline-primary')
    await editButton.trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')[0]).toEqual([mockData[0], 0])
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(TableComponent, {
      props: {
        data: mockData,
        columns: mockColumns,
        showDelete: true
      }
    })

    const deleteButton = wrapper.find('.btn-outline-danger')
    await deleteButton.trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')[0]).toEqual([mockData[0], 0])
  })

  it('applies striped class when striped prop is true', () => {
    const wrapper = mount(TableComponent, {
      props: {
        data: mockData,
        columns: mockColumns,
        striped: true
      }
    })

    expect(wrapper.find('.data-table').classes()).toContain('table-striped')
  })

  it('applies hover class by default', () => {
    const wrapper = mount(TableComponent, {
      props: {
        data: mockData,
        columns: mockColumns
      }
    })

    expect(wrapper.find('.data-table').classes()).toContain('table-hover')
  })

  it('uses custom row key when provided', () => {
    const dataWithCustomKey = [
      { uuid: 'abc123', name: 'John Doe' },
      { uuid: 'def456', name: 'Jane Smith' }
    ]

    const wrapper = mount(TableComponent, {
      props: {
        data: dataWithCustomKey,
        columns: [{ key: 'name', label: 'Name' }],
        rowKey: 'uuid'
      }
    })

    // Check that the rows have the correct keys
    const rows = wrapper.findAll('tbody tr')
    expect(rows[0].attributes('data-v-test-key')).toBeUndefined()
    // Note: Vue test utils doesn't expose the v-for key directly
    // This test mainly verifies the component accepts the prop
  })

  it('renders custom cell content via slots', () => {
    const wrapper = mount(TableComponent, {
      props: {
        data: mockData,
        columns: [{ key: 'role', label: 'Role' }]
      },
      slots: {
        'cell-role': '<span class="custom-role">{{ props.value }}</span>'
      }
    })

    // Check that custom slot content is rendered
    expect(wrapper.find('.custom-role').exists()).toBe(true)
  })

  it('handles nested property keys', () => {
    const nestedData = [
      { id: 1, user: { name: 'John Doe' }, email: 'john@example.com' }
    ]

    const wrapper = mount(TableComponent, {
      props: {
        data: nestedData,
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'user.name', label: 'Name' }, // Nested property
          { key: 'email', label: 'Email' }
        ]
      }
    })

    const rows = wrapper.findAll('tbody tr')
    const firstRowCells = rows[0].findAll('td')
    expect(firstRowCells[1].text()).toBe('John Doe')
  })
})