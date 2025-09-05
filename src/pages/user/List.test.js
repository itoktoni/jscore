import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import List from './List.vue'
import FormTable from '../../components/FormTable.vue'
import FormInput from '../../components/FormInput.vue'
import FormSelect from '../../components/FormSelect.vue'

// Mock the useAlert composable
vi.mock('../../composables/useAlert', () => ({
  useAlert: () => ({
    alertSuccess: vi.fn(),
    alertError: vi.fn(),
    alertConfirm: vi.fn().mockResolvedValue({ isConfirmed: true })
  })
}))

// Mock the http service
const mockHttp = {
  get: vi.fn()
}

vi.mock('../../stores/http', () => ({
  http: mockHttp
}))

// Create a router instance for testing
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/users', name: 'user.list', component: { template: '<div>Users</div>' } },
    { path: '/users/create', name: 'CreateUser', component: { template: '<div>Create User</div>' } },
    { path: '/users/:id/edit', name: 'user.edit', component: { template: '<div>Edit User</div>' } }
  ]
})

describe('User List Page', () => {
  it('renders correctly with FormTable component', () => {
    const wrapper = mount(List, {
      global: {
        plugins: [router, createTestingPinia()],
        mocks: {
          $route: {
            name: 'user.list'
          }
        }
      }
    })

    // Check that the page header is rendered
    expect(wrapper.find('.page-header h2').text()).toBe('Users')
    expect(wrapper.find('.page-header p').text()).toBe('Manage user accounts and permissions')

    // Check that FormTable is rendered
    expect(wrapper.findComponent(FormTable).exists()).toBe(true)

    // Check that filter form elements are rendered
    expect(wrapper.findAllComponents(FormInput)).toHaveLength(2)
    expect(wrapper.findAllComponents(FormSelect)).toHaveLength(1)

    // Check that the create button is rendered
    expect(wrapper.find('.form-actions .btn-primary').text()).toBe('Create New User')
  })

  it('passes correct props to FormTable', () => {
    const wrapper = mount(List, {
      global: {
        plugins: [router, createTestingPinia()],
        mocks: {
          $route: {
            name: 'user.list'
          }
        }
      }
    })

    const formTable = wrapper.findComponent(FormTable)
    expect(formTable.props().endpoint).toBe('/api/users')
    expect(formTable.props().initialData).toEqual({
      username: '',
      email: '',
      role: ''
    })
  })

  it('renders filter form with correct fields', () => {
    const wrapper = mount(List, {
      global: {
        plugins: [router, createTestingPinia()],
        mocks: {
          $route: {
            name: 'user.list'
          }
        }
      }
    })

    // Check username filter
    const usernameInput = wrapper.findComponent('[name="username"]')
    expect(usernameInput.exists()).toBe(true)
    expect(usernameInput.props().label).toBe('Username')
    expect(usernameInput.props().placeholder).toBe('Search by username')
    expect(usernameInput.props().col).toBe('4')

    // Check email filter
    const emailInput = wrapper.findComponent('[name="email"]')
    expect(emailInput.exists()).toBe(true)
    expect(emailInput.props().label).toBe('Email')
    expect(emailInput.props().placeholder).toBe('Search by email')
    expect(emailInput.props().col).toBe('4')

    // Check role filter
    const roleSelect = wrapper.findComponent('[name="role"]')
    expect(roleSelect.exists()).toBe(true)
    expect(roleSelect.props().label).toBe('Role')
    expect(roleSelect.props().col).toBe('4')
    expect(roleSelect.props().options).toEqual([
      { label: 'All Roles', value: '' },
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' }
    ])
  })

  it('renders table with correct columns', async () => {
    const mockResponse = {
      data: {
        data: [
          { id: 1, username: 'john_doe', name: 'John Doe', email: 'john@example.com', role: 'user' },
          { id: 2, username: 'jane_smith', name: 'Jane Smith', email: 'jane@example.com', role: 'admin' }
        ],
        current_page: 1,
        last_page: 1
      }
    }

    mockHttp.get.mockResolvedValue(mockResponse)

    const wrapper = mount(List, {
      global: {
        plugins: [router, createTestingPinia()],
        mocks: {
          $route: {
            name: 'user.list'
          }
        }
      }
    })

    // Trigger the search to load data
    const formTable = wrapper.findComponent(FormTable)
    await formTable.vm.handleSearch()

    // Check that table headers are rendered
    const headers = wrapper.findAll('thead th')
    expect(headers).toHaveLength(6)
    expect(headers[0].text()).toBe('ID')
    expect(headers[1].text()).toBe('Username')
    expect(headers[2].text()).toBe('Name')
    expect(headers[3].text()).toBe('Email')
    expect(headers[4].text()).toBe('Role')
    expect(headers[5].text()).toBe('Actions')

    // Check that table rows are rendered
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)

    // Check first row data
    const firstRowCells = rows[0].findAll('td')
    expect(firstRowCells[0].text()).toBe('1')
    expect(firstRowCells[1].text()).toBe('john_doe')
    expect(firstRowCells[2].text()).toBe('John Doe')
    expect(firstRowCells[3].text()).toBe('john@example.com')
    expect(firstRowCells[4].text()).toBe('user')

    // Check second row data
    const secondRowCells = rows[1].findAll('td')
    expect(secondRowCells[0].text()).toBe('2')
    expect(secondRowCells[1].text()).toBe('jane_smith')
    expect(secondRowCells[2].text()).toBe('Jane Smith')
    expect(secondRowCells[3].text()).toBe('jane@example.com')
    expect(secondRowCells[4].text()).toBe('admin')

    // Check action buttons
    const editButtons = wrapper.findAll('.btn-outline-primary')
    const deleteButtons = wrapper.findAll('.btn-outline-danger')
    expect(editButtons).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
  })

  it('handles delete user functionality', async () => {
    const mockResponse = {
      data: {
        data: [
          { id: 1, username: 'john_doe', name: 'John Doe', email: 'john@example.com', role: 'user' }
        ],
        current_page: 1,
        last_page: 1
      }
    }

    mockHttp.get.mockResolvedValue(mockResponse)

    const wrapper = mount(List, {
      global: {
        plugins: [router, createTestingPinia()],
        mocks: {
          $route: {
            name: 'user.list'
          }
        }
      }
    })

    // Load data
    const formTable = wrapper.findComponent(FormTable)
    await formTable.vm.handleSearch()

    // Find the delete button and click it
    const deleteButton = wrapper.find('.btn-outline-danger')
    expect(deleteButton.exists()).toBe(true)

    await deleteButton.trigger('click')

    // Verify that search is triggered again (refresh after delete)
    expect(mockHttp.get).toHaveBeenCalledTimes(2)
  })

  it('navigates to create user page when create button is clicked', () => {
    const wrapper = mount(List, {
      global: {
        plugins: [router, createTestingPinia()],
        mocks: {
          $route: {
            name: 'user.list'
          }
        }
      }
    })

    const createButton = wrapper.find('.form-actions .btn-primary')
    expect(createButton.exists()).toBe(true)
    expect(createButton.text()).toBe('Create New User')

    // Note: Actual navigation testing would require more complex setup
    // This test just verifies the button exists and has correct text
  })

  it('shows no data message when table is empty', async () => {
    const mockResponse = {
      data: {
        data: [],
        current_page: 1,
        last_page: 1
      }
    }

    mockHttp.get.mockResolvedValue(mockResponse)

    const wrapper = mount(List, {
      global: {
        plugins: [router, createTestingPinia()],
        mocks: {
          $route: {
            name: 'user.list'
          }
        }
      }
    })

    // Load data
    const formTable = wrapper.findComponent(FormTable)
    await formTable.vm.handleSearch()

    // Check that no data message is displayed
    const noDataMessage = wrapper.find('tbody .text-center')
    expect(noDataMessage.exists()).toBe(true)
    expect(noDataMessage.text()).toBe('No users found')
  })
})