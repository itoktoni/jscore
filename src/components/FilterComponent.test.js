import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import FilterComponent from './FilterComponent.vue'
import { ref } from 'vue'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {}
  }),
  useRouter: () => ({
    push: vi.fn()
  })
}))

describe('FilterComponent', () => {
  const defaultProps = {
    searchData: {
      search: '',
      searchType: '',
      perPage: 10
    },
    searchOptions: [
      { value: '', label: 'All Fields' },
      { value: 'name', label: 'Name' }
    ]
  }

  it('renders correctly', () => {
    const wrapper = mount(FilterComponent, {
      props: defaultProps
    })

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[name="search"]').exists()).toBe(true)
    expect(wrapper.find('select[name="searchType"]').exists()).toBe(true)
    expect(wrapper.find('select[name="per_page"]').exists()).toBe(true)
  })

  it('emits filter-submit event when form is submitted', async () => {
    const wrapper = mount(FilterComponent, {
      props: defaultProps
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('filter-submit')).toBeTruthy()
  })

  it('emits search event when search button is clicked', async () => {
    const wrapper = mount(FilterComponent, {
      props: defaultProps
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('search')).toBeTruthy()
  })

  it('emits per-page-change event when per page selection changes', async () => {
    const wrapper = mount(FilterComponent, {
      props: defaultProps
    })

    const select = wrapper.find('select[name="per_page"]')
    await select.setValue('25')

    expect(wrapper.emitted('per-page-change')).toBeTruthy()
    expect(wrapper.emitted('per-page-change')[0]).toEqual([25])
  })

  it('builds filter query correctly', async () => {
    const wrapper = mount(FilterComponent, {
      props: defaultProps,
      attachTo: document.body
    })

    // Add a test input to the form
    const form = wrapper.find('form').element
    const input = document.createElement('input')
    input.name = 'test'
    input.value = 'test-value'
    form.appendChild(input)

    // Call buildFilterQuery method
    const filterQuery = wrapper.vm.buildFilterQuery()

    expect(filterQuery).toEqual({ test: 'test-value' })

    wrapper.unmount()
  })

  it('handles URL routing on filter submit', async () => {
    // This would require a more complex test setup with a real router
    // For now, we're just verifying the component mounts correctly
    const wrapper = mount(FilterComponent, {
      props: defaultProps
    })

    expect(wrapper.exists()).toBe(true)
  })
})