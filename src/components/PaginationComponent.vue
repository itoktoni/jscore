<template>
  <div v-if="totalPages > 1" class="pagination mt-3">
    <!-- Previous Button -->
    <FormButton
      @click="handlePageChange(currentPage - 1)"
      :disabled="currentPage <= 1"
      variant="secondary"
      text="Previous"
      size="small"
    />

    <!-- Page Numbers - Simplified -->
    <div class="pagination-pages">
      <!-- First pages (1-2) -->
      <template v-for="page in Math.min(2, totalPages)" :key="page">
        <FormButton
          @click="handlePageChange(page)"
          :variant="page === currentPage ? 'primary' : 'secondary'"
          :text="page.toString()"
          size="small"
          :class="{ 'active': page === currentPage }"
        />
      </template>

      <!-- Ellipsis if needed -->
      <span v-if="currentPage > 4 && totalPages > 5" class="pagination-ellipsis">...</span>

      <!-- Pages around current page -->
      <template v-for="page in getPagesAroundCurrent()" :key="page">
        <FormButton
          v-if="page > 2 && page <= totalPages - 2"
          @click="handlePageChange(page)"
          :variant="page === currentPage ? 'primary' : 'secondary'"
          :text="page.toString()"
          size="small"
          :class="{ 'active': page === currentPage }"
        />
      </template>

      <!-- Ellipsis if needed -->
      <span v-if="currentPage < totalPages - 3 && totalPages > 5" class="pagination-ellipsis">...</span>

      <!-- Last pages -->
      <template v-for="page in getLastPages()" :key="page">
        <FormButton
          v-if="page > 2"
          @click="handlePageChange(page)"
          :variant="page === currentPage ? 'primary' : 'secondary'"
          :text="page.toString()"
          size="small"
          :class="{ 'active': page === currentPage }"
        />
      </template>
    </div>

    <!-- Next Button -->
    <FormButton
      @click="handlePageChange(currentPage + 1)"
      :disabled="currentPage >= totalPages"
      variant="secondary"
      text="Next"
      size="small"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FormButton from './FormButton.vue'

// Props
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  }
})

// Emits
const emit = defineEmits(['change-page'])

// Computed function to get pages around current page
function getPagesAroundCurrent() {
  const currentPage = props.currentPage
  const totalPages = props.totalPages
  const pages = []

  // Add 2 pages before current (if they exist and are not first pages)
  for (let i = Math.max(3, currentPage - 2); i < currentPage; i++) {
    pages.push(i)
  }

  // Add current page (if it's not already added as first or last)
  if (currentPage > 2 && currentPage <= totalPages - 2) {
    pages.push(currentPage)
  }

  // Add 2 pages after current (if they exist and are not last pages)
  for (let i = currentPage + 1; i <= Math.min(totalPages - 2, currentPage + 2); i++) {
    pages.push(i)
  }

  return pages
}

// Computed function to get last pages
function getLastPages() {
  const totalPages = props.totalPages
  const pages = []

  // Add last 2 pages (if they exist and are not first pages)
  for (let i = Math.max(3, totalPages - 1); i <= totalPages; i++) {
    pages.push(i)
  }

  return pages
}

// Handle page change function
function handlePageChange(page) {
  // Ensure page is within valid range
  const validPage = Math.max(1, Math.min(page, props.totalPages))

  // Only emit if the page actually changes
  if (validPage !== props.currentPage) {
    // Emit page change event
    emit('change-page', validPage)
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem 0;
}

.pagination-pages {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-ellipsis {
  padding: 0.375rem 0.25rem;
  color: #6c757d;
}

.mt-3 {
  margin-top: 1rem;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .pagination {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination-pages {
    justify-content: stretch;
  }

  .pagination-pages .button {
    flex: 1;
    margin: 0.125rem;
  }
}
</style>