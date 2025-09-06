import { ref, computed } from 'vue'

/**
 * Composable for managing selection state in tables
 * Provides reactive state and methods for handling item selection
 */
export function useSelectionState() {
  // Reactive state for selected items
  const selectedItems = ref([])

  /**
   * Update the selected items
   * @param {Array} newSelectedItems - Array of selected item IDs
   */
  const updateSelectedItems = (newSelectedItems) => {
    selectedItems.value = newSelectedItems
  }

  /**
   * Toggle selection of an item
   * @param {string|number} itemId - The ID of the item to toggle
   */
  const toggleItemSelection = (itemId) => {
    const index = selectedItems.value.indexOf(itemId)
    if (index > -1) {
      // Item is already selected, remove it
      selectedItems.value.splice(index, 1)
    } else {
      // Item is not selected, add it
      selectedItems.value.push(itemId)
    }
  }

  /**
   * Select all items
   * @param {Array} allItemIds - Array of all item IDs to select
   */
  const selectAllItems = (allItemIds) => {
    selectedItems.value = [...allItemIds]
  }

  /**
   * Clear all selections
   */
  const clearSelection = () => {
    selectedItems.value = []
  }

  /**
   * Check if an item is selected
   * @param {string|number} itemId - The ID of the item to check
   * @returns {boolean} - Whether the item is selected
   */
  const isItemSelected = (itemId) => {
    return selectedItems.value.includes(itemId)
  }

  /**
   * Check if all items are selected
   * @param {Array} allItemIds - Array of all item IDs
   * @returns {boolean} - Whether all items are selected
   */
  const areAllItemsSelected = (allItemIds) => {
    if (allItemIds.length === 0) return false
    return allItemIds.every(id => selectedItems.value.includes(id))
  }

  /**
   * Check if some items are selected (for indeterminate state)
   * @param {Array} allItemIds - Array of all item IDs
   * @returns {boolean} - Whether some but not all items are selected
   */
  const areSomeItemsSelected = (allItemIds) => {
    return selectedItems.value.length > 0 && selectedItems.value.length < allItemIds.length
  }

  return {
    // State
    selectedItems,

    // Methods
    updateSelectedItems,
    toggleItemSelection,
    selectAllItems,
    clearSelection,
    isItemSelected,
    areAllItemsSelected,
    areSomeItemsSelected
  }
}