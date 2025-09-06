import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import Button from './Button.vue'

// Mock the useAlert composable
vi.mock('../composables/useAlert', () => ({
  useAlert: () => ({
    alertConfirm: vi.fn().mockResolvedValue({ isConfirmed: true }),
    alertSuccess: vi.fn(),
    alertError: vi.fn()
  })
}))

// Mock the http service
vi.mock('../stores/http', () => ({
  http: {
    get: vi.fn().mockResolvedValue({}),
    post: vi.fn().mockResolvedValue({})
  }
}))

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

describe('Button', () => {
  it('renders submit button correctly', () => {
    const wrapper = mount(Button, {
      props: {
        buttonType: 'submit',
        text: 'Submit'
      }
    })

    expect(wrapper.text()).toContain('Submit')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('renders link button correctly', () => {
    const wrapper = mount(Button, {
      props: {
        buttonType: 'link',
        text: 'Already have an account?',
        linkText: 'Login here',
        to: '/login'
      }
    })

    expect(wrapper.text()).toContain('Already have an account?')
    expect(wrapper.text()).toContain('Login here')
    expect(wrapper.find('.form-link').exists()).toBe(true)
  })

  it('renders delete button correctly', () => {
    const wrapper = mount(Button, {
      props: {
        buttonType: 'delete',
        text: 'Delete',
        url: '/api/users/1'
      }
    })

    expect(wrapper.text()).toContain('Delete')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('renders remove button correctly', () => {
    const wrapper = mount(Button, {
      props: {
        buttonType: 'remove',
        text: 'Delete Selected',
        url: '/api/users/delete',
        selectedItems: [1, 2, 3]
      }
    })

    expect(wrapper.text()).toContain('Delete Selected')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('emits click event for button type', async () => {
    const wrapper = mount(Button, {
      props: {
        buttonType: 'button',
        text: 'Click Me'
      }
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})