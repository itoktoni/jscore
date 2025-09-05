import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import FormTable from './FormTable.vue'
import FormInput from './FormInput.vue'
import FormSelect from './FormSelect.vue'

// Mock the http service
const mockHttp = {
  get: vi.fn()
}

vi.mock('../stores/http', () => ({
  http: mockHttp
}))

// Create a router instance for testing
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/users', component: { template: '<div>Users</div>' } }
  ]
})

describe('FormTable', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Reset any modified state after each test
    vi.resetAllMocks()
  })

  it('renders correctly with required props', () => {
    const wrapper = mount(FormTable, {
      props: {
        endpoint: '/api/users'
      },
      slots: {
        default: '<div>Filter Form</div>',
        table: '<div>Table Content</div>'
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.form-table-container').exists()).toBe(true)
    expect(wrapper.props().endpoint).toBe('/api/users')
  })

  it('renders filter form elements correctly', () => {
    const wrapper = mount(FormTable, {
      props: {
        endpoint: '/api/users',
        initialData: { username: '', email: '', role: '' }
      },
      slots: {
        default: `
          <FormInput name="username" label="Username" />
          <FormInput name="email" label="Email" />
          <FormSelect name="role" label="Role" />
        `,
        table: '<div>Table Content</div>'
      },
      global: {
        plugins: [router],
        components: {
          FormInput,
          FormSelect
        }
      }
    })

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.findAllComponents(FormInput)).toHaveLength(2)
    expect(wrapper.findAllComponents(FormSelect)).toHaveLength(1)
  })

  it('handles search submission with form data', async () => {
    const mockResponse = {
      data: {
        data: [
          { id: 1, username: 'john_doe', email: 'john@example.com', role: 'user' },
          { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'admin' }
        ],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 2
      }
    }

    mockHttp.get.mockResolvedValue(mockResponse)

    const wrapper = mount(FormTable, {
      props: {
        endpoint: '/api/users',
        initialData: { username: '', email: '', role: '' }
      },
      slots: {
        default: `
          <FormInput name="username" />
          <FormInput name="email" />
          <FormSelect name="role" />
        `,
        table: '<div>Table Content</div>'
      },
      global: {
        plugins: [router],
        components: {
          FormInput,
          FormSelect
        }
      }
    })

    // Set form data
    wrapper.vm.formData.username = 'john'
    wrapper.vm.formData.email = 'john@example.com'
    wrapper.vm.formData.role = 'user'

    // Trigger search
    await wrapper.vm.handleSearch()

    // Verify API call was made with correct parameters
    expect(mockHttp.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/users?')
    )
    expect(mockHttp.get).toHaveBeenCalledWith(
      expect.stringContaining('username=john')
    )
    expect(mockHttp.get).toHaveBeenCalledWith(
      expect.stringContaining('email=john@example.com')
    )
    expect(mockHttp.get).toHaveBeenCalledWith(
      expect.stringContaining('role=user')
    )
    expect(mockHttp.get).toHaveBeenCalledWith(
      expect.stringContaining('page=1')
    )

    // Verify data was loaded
    expect(wrapper.vm.tableData).toHaveLength(2)
    expect(wrapper.vm.pagination.current_page).toBe(1)
  })

  it('handles pagination correctly', async () => {
    const mockResponse = {
      data: {
        data: [],
        current_page: 2,
        last_page: 5,
        per_page: 10,
        total: 50
      }
    }

    mockHttp.get.mockResolvedValue(mockResponse)

    const wrapper = mount(FormTable, {
      props: {
        endpoint: '/api/users'
      },
      slots: {
        default: '<div>Filter Form</div>',
        table: '<div>Table Content</div>'
      },
      global: {
        plugins: [router]
      }
    })

    // Set initial pagination
    wrapper.vm.pagination = {
      current_page: 1,
      last_page: 5
    }

    // Change to page 2
    await wrapper.vm.changePage(2)

    // Verify API call was made with correct page
    expect(mockHttp.get).toHaveBeenCalledWith(
      expect.stringContaining('page=2')
    )
    expect(wrapper.vm.pagination.current_page).toBe(2)
  })

  it('handles form reset correctly', async () => {
    const wrapper = mount(FormTable, {
      props: {
        endpoint: '/api/users',
        initialData: { username: 'initial', email: '', role: '' }
      },
      slots: {
        default: `
          <FormInput name="username" />
          <FormInput name="email" />
          <FormSelect name="role" />
        `,
        table: '<div>Table Content</div>'
      },
      global: {
        plugins: [router],
        components: {
          FormInput,
          FormSelect
        }
      }
    })

    // Modify form data
    wrapper.vm.formData.username = 'modified'
    wrapper.vm.formData.email = 'test@example.com'

    // Reset form
    wrapper.vm.handleReset()

    // Verify form was reset to initial values
    expect(wrapper.vm.formData.username).toBe('initial')
    expect(wrapper.vm.formData.email).toBe('')
    expect(wrapper.vm.formData.role).toBe('')

    // Verify errors were cleared
    expect(wrapper.vm.fieldErrors).toEqual({})
  })

  it('handles API errors correctly', async () => {
    const mockError = new Error('Network error')
    mockHttp.get.mockRejectedValue(mockError)

    const wrapper = mount(FormTable, {
      props: {
        endpoint: '/api/users'
      },
      slots: {
        default: '<div>Filter Form</div>',
        table: '<div>Table Content</div>'
      },
      global: {
        plugins: [router]
      }
    })

    // Spy on error emit
    const errorSpy = vi.spyOn(wrapper.vm, '$emit')

    // Trigger search which should fail
    await wrapper.vm.handleSearch()

    // Verify error was emitted
    expect(errorSpy).toHaveBeenCalledWith('error', mockError)

    // Verify loading states are reset
    expect(wrapper.vm.isSubmitting).toBe(false)
    expect(wrapper.vm.loading).toBe(false)
  })

  it('handles validation errors correctly', async () => {
    const validationError = {
      response: {
        status: 422,
        data: {
          errors: {
            username: ['The username field is required.']
          }
        }
      }
    }

    mockHttp.get.mockRejectedValue(validationError)

    const wrapper = mount(FormTable, {
      props: {
        endpoint: '/api/users'
      },
      slots: {
        default: '<FormInput name="username" />',
        table: '<div>Table Content</div>'
      },
      global: {
        plugins: [router],
        components: {
          FormInput
        }
      }
    })

    // Trigger search which should fail with validation errors
    await wrapper.vm.handleSearch()

    // Verify validation error was set
    expect(wrapper.vm.fieldErrors.username).toBe('The username field is required.')
  })

  it('renders table data correctly when provided', async () => {
    const mockData = [
      { id: 1, username: 'john_doe', email: 'john@example.com', role: 'user' },
      { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'admin' }
    ]

    const wrapper = mount(FormTable, {
      props: {
        endpoint: '/api/users'
      },
      slots: {
        default: '<div>Filter Form</div>',
        table: `
          <template #table="{ data }">
            <table>
              <tbody>
                <tr v-for="item in data" :key="item.id">
                  <td>{{ item.username }}</td>
                  <td>{{ item.email }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        `
      },
      global: {
        plugins: [router]
      }
    })

    // Set mock data
    wrapper.vm.tableData = mockData
    await wrapper.vm.$nextTick()

    // Verify table rows are rendered
    const rows = wrapper.findAll('tr')
    expect(rows).toHaveLength(2)

    // Verify data is displayed correctly
    expect(rows[0].text()).toContain('john_doe')
    expect(rows[0].text()).toContain('john@example.com')
    expect(rows[1].text()).toContain('jane_smith')
    expect(rows[1].text()).toContain('jane@example.com')
  })

  it('shows loading state during search', async () => {
    // Create a delayed promise to simulate loading
    const delayedPromise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            data: [],
            current_page: 1,
            last_page: 1
          }
        })
      }, 100)
    })

    mockHttp.get.mockReturnValue(delayedPromise)

    const wrapper = mount(FormTable, {
      props: {
        endpoint: '/api/users'
      },
      slots: {
        default: '<div>Filter Form</div>',
        table: `
          <template #table="{ loading }">
            <div v-if="loading">Loading...</div>
            <div v-else>Content</div>
          </template>
        `
      },
      global: {
        plugins: [router]
      }
    })

    // Trigger search
    const searchPromise = wrapper.vm.handleSearch()

    // Check if loading state is true immediately
    expect(wrapper.vm.loading).toBe(true)
    expect(wrapper.text()).toContain('Loading...')

    // Wait for search to complete
    await searchPromise

    // Check if loading state is false after completion
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.text()).toContain('Content')
  })

  it('emits search event on successful search', async () => {
    const mockResponse = {
      data: {
        data: [{ id: 1, username: 'john_doe' }],
        current_page: 1,
        last_page: 1
      }
    }

    mockHttp.get.mockResolvedValue(mockResponse)

    const wrapper = mount(FormTable, {
      props: {
        endpoint: '/api/users'
      },
      slots: {
        default: '<div>Filter Form</div>',
        table: '<div>Table Content</div>'
      },
      global: {
        plugins: [router]
      }
    })

    // Spy on search emit
    const searchSpy = vi.spyOn(wrapper.vm, '$emit')

    // Trigger search
    await wrapper.vm.handleSearch()

    // Verify search event was emitted with response
    expect(searchSpy).toHaveBeenCalledWith('search', mockResponse)
  })
})