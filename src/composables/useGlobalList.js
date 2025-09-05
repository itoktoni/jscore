import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useGlobalList(apiRoutes, usePaginationComposable, useAlertComposable) {
  const router = useRouter()
  const route = useRoute()
  const filterComponent = ref(null)
  const { alertConfirm, alertSuccess, alertError } = useAlertComposable()
  const {
    items,
    loading,
    error,
    pagination,
    fetchItems,
    searchItems,
    hasItems
  } = usePaginationComposable(apiRoutes.list)

  // Modal states
  const showModal = ref(false)
  const selectedItem = ref(null)
  const itemToDelete = ref(null)

  // Table selection states
  const selectAll = ref(false)

  // Search data
  const searchData = reactive({
    search: '',
    searchType: '',
    perPage: 10
  })

  // Footer functionality
  const hasSelectedItems = computed(() => {
    if (!items.value) return false
    return items.value.some(item => item.selected)
  })

  // Methods
  async function handleFilterSubmit({ filterQuery, searchData: updatedSearchData }) {
    // Update local searchData
    Object.assign(searchData, updatedSearchData)

    // Apply filters
    if (updatedSearchData.search.trim()) {
      await searchItems(updatedSearchData.search.trim(), 1, updatedSearchData.perPage, filterQuery)
    } else {
      await fetchItems(1, updatedSearchData.perPage, filterQuery)
    }
  }

  async function handleSearch({ filterQuery, searchData: updatedSearchData }) {
    // Update local searchData
    Object.assign(searchData, updatedSearchData)

    if (updatedSearchData.search.trim()) {
      // Build the search query to match the required format
      const searchParams = {
        ...filterQuery,
        search: updatedSearchData.search.trim()
      }

      // Map searchType to filter parameter
      if (updatedSearchData.searchType) {
        searchParams.filter = updatedSearchData.searchType
      }

      await searchItems(updatedSearchData.search.trim(), 1, updatedSearchData.perPage, searchParams)
    } else {
      await loadItems(1)
    }
  }

  async function handlePerPageChange(perPage) {
    searchData.perPage = perPage
    // Reset to first page when changing per page count
    await loadItems(1)
  }

  async function handleCreate(navigationRoute) {
    router.push({ name: navigationRoute })
  }

  async function handleEdit(item, navigationRoute) {
    if (showModal.value) showModal.value = false
    router.push({ name: navigationRoute, params: { id: item.id } })
  }

  async function handleView(item) {
    selectedItem.value = item
    showModal.value = true
  }

  // Confirm delete function
  async function confirmDelete(item) {
    const result = await alertConfirm(
      'Confirm Delete',
      `Are you sure you want to delete "${item.name || item.username || 'this item'}"? This action cannot be undone.`
    )

    if (result.isConfirmed) {
      itemToDelete.value = item
      await deleteItem()
    }
  }

  // Delete item function
  async function deleteItem() {
    if (itemToDelete.value) {
      try {
        loading.value = true
        const response = await fetch(apiRoutes.delete(itemToDelete.value.id))

        // Remove item from the list
        items.value = items.value.filter(item => item.id !== itemToDelete.value.id)

        itemToDelete.value = null

        // Refresh the item list to ensure pagination is correct
        await loadItems()

        alertSuccess('Success', 'Item deleted successfully!')
      } catch (err) {
        // Handle authentication errors
        if (err.response?.status === 401) {
          const message = err.response.data?.message || ''
          if (message.toLowerCase().includes('unauthenticated')) {
            // The auth error should be handled by the http service or pagination composable
            // Just re-throw to let it be handled upstream
            throw err
          }
        }

        error.value = err.message
        itemToDelete.value = null
        await loadItems()
        alertError('Error', 'Failed to delete item')
      } finally {
        loading.value = false
      }
    }
  }

  // Delete selected items function
  async function deleteSelected(httpClient, removeEndpoint) {
    if (!items.value) return

    const selectedItems = items.value.filter(item => item.selected)
    if (selectedItems.length === 0) return

    const result = await alertConfirm(
      'Confirm Delete',
      `Are you sure you want to delete ${selectedItems.length} selected item(s)? This action cannot be undone.`
    )

    if (result.isConfirmed) {
      try {
        loading.value = true

        // Extract IDs from selected items
        const selectedIds = selectedItems.map(item => item.id)

        // Send DELETE request with selected IDs in the request body
        await httpClient.post(removeEndpoint, { code: selectedIds })

        // Refresh the item list
        await loadItems()
        alertSuccess('Success', `${selectedItems.length} item(s) deleted successfully!`)
      } catch (err) {
        // Handle authentication errors
        if (err.response?.status === 401) {
          const message = err.response.data?.message || ''
          if (message.toLowerCase().includes('unauthenticated')) {
            // The auth error should be handled by the http service or pagination composable
            // Just re-throw to let it be handled upstream
            throw err
          }
        }

        error.value = err.message
        await loadItems()
        alertError('Error', 'Failed to delete selected items')
      } finally {
        loading.value = false
      }
    }
  }

  // Table selection methods
  function toggleSelectAll() {
    // Toggle the selectAll state first
    selectAll.value = !selectAll.value

    if (items.value) {
      items.value.forEach(item => {
        item.selected = selectAll.value
      })
    }
  }

  function updateSelectAll(item) {
    if (item) {
      // Toggle the item's selected state
      item.selected = !item.selected
    }

    if (items.value) {
      const selectedItems = items.value.filter(item => item.selected)
      selectAll.value = selectedItems.length === items.value.length && items.value.length > 0
    }
  }

  // Simplified changePage function for better performance
  async function changePage(page) {
    // Ensure page is within valid range
    const validPage = Math.max(1, Math.min(page, pagination.totalPages))

    // Update URL with page parameter
    const query = { ...route.query, page: validPage }
    if (validPage === 1) {
      delete query.page // Remove page param if it's page 1 (default)
    }

    // Navigate to the new page
    await router.push({ path: route.path, query }).catch(err => {
      console.warn('Router push failed:', err)
    })
  }

  // Simplified loadItems function
  async function loadItems(page = 1, filterQuery = {}) {
    // Build filter query from form if not provided
    const filters = Object.keys(filterQuery).length > 0 ? filterQuery :
      (filterComponent.value ? filterComponent.value.buildFilterQuery() : {})
    await fetchItems(page, searchData.perPage, filters)
  }

  // Refresh data when route is updated (e.g. when navigating back from item form)
  function handleRouteUpdate(to, from) {
    if (to.path === route.path) {
      const page = parseInt(to.query.page) || 1

      // Reset form fields if no query parameters
      if (Object.keys(to.query).length === 0 && filterComponent.value) {
        filterComponent.value.resetFormFields()
      }

      loadItems(page)
    }
  }

  // Initialize
  async function initialize(searchOptions = []) {
    // Check URL for initial page and search parameters
    const page = parseInt(route.query.page) || 1
    const search = route.query.search || ''
    const filter = route.query.filter || ''

    searchData.search = search
    searchData.searchType = filter // Map filter parameter back to searchType
    searchData.perPage = route.query.per_page || 10

    // Apply filters from URL query parameters
    const filterQuery = { ...route.query }
    delete filterQuery.page
    delete filterQuery.search
    delete filterQuery.filter
    delete filterQuery.per_page

    if (search.trim()) {
      // Ensure filter parameter is included in the query
      const searchParams = {
        ...filterQuery,
        search: search.trim()
      }

      if (filter) {
        searchParams.filter = filter
      }

      await searchItems(search.trim(), page, searchData.perPage, searchParams)
    } else {
      await loadItems(page, filterQuery)
    }
  }

  // Watch for route changes to populate form fields
  const routeWatcher = watch(() => route.query, () => {
    // Update searchData from route query
    searchData.search = route.query.search || ''
    searchData.searchType = route.query.filter || ''
    searchData.perPage = route.query.per_page || 10

    // Populate form fields after DOM update
    if (filterComponent.value) {
      setTimeout(() => {
        filterComponent.value.populateFormFromQuery()
      }, 0)
    }
  }, { immediate: true })

  // Cleanup watcher when component is unmounted
  onBeforeUnmount(() => {
    routeWatcher()
  })

  return {
    // Refs
    filterComponent,
    items,
    loading,
    error,
    pagination,
    showModal,
    selectedItem,
    itemToDelete,
    selectAll,

    // Reactive data
    searchData,

    // Computed
    hasItems,
    hasSelectedItems,

    // Methods
    handleFilterSubmit,
    handleSearch,
    handlePerPageChange,
    handleCreate,
    handleEdit,
    handleView,
    confirmDelete,
    deleteItem,
    deleteSelected,
    toggleSelectAll,
    updateSelectAll,
    changePage,
    loadItems,
    handleRouteUpdate,
    initialize
  }
}