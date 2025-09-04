import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import TableAction from './TableAction.vue'

describe('TableAction', () => {
  it('renders correctly with icon and title', () => {
    const wrapper = mount(TableAction, {
      props: {
        icon: 'bi bi-eye',
        title: 'View'
      }
    })

    expect(wrapper.find('i').classes()).toContain('bi-eye')
    expect(wrapper.attributes('title')).toBe('View')
  })

  it('renders correctly with text', () => {
    const wrapper = mount(TableAction, {
      props: {
        text: 'Edit',
        title: 'Edit'
      }
    })

    expect(wrapper.text()).toContain('Edit')
  })

  it('applies correct CSS classes based on variant', () => {
    const wrapper = mount(TableAction, {
      props: {
        variant: 'primary',
        title: 'Primary Action'
      }
    })

    expect(wrapper.classes()).toContain('table-action--primary')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(TableAction, {
      props: {
        title: 'Click Me'
      }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('renders icon and text together', () => {
    const wrapper = mount(TableAction, {
      props: {
        icon: 'bi bi-pencil',
        text: 'Edit',
        title: 'Edit'
      }
    })

    expect(wrapper.find('i').classes()).toContain('bi-pencil')
    expect(wrapper.text()).toContain('Edit')
  })
})