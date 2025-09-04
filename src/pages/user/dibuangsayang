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

    <!-- Page Numbers - Fixed structure: 1 first, 3 around current, 1 last -->
    <div class="pagination-pages">
      <!-- First page (1) -->
      <FormButton
        v-if="totalPages >= 1"
        @click="handlePageChange(1)"
        :variant="1 === currentPage ? 'primary' : 'secondary'"
        text="1"
        size="small"
        :class="{ 'active': 1 === currentPage }"
      />

      <!-- Ellipsis if current page is beyond the first few pages -->
      <span v-if="currentPage > 3 && totalPages > 5" class="pagination-ellipsis">...</span>

      <!-- Pages around current page -->
      <template v-for="page in getPagesAroundCurrent()" :key="page">
        <FormButton
          v-if="page > 1 && page < totalPages"
          @click="handlePageChange(page)"
          :variant="page === currentPage ? 'primary' : 'secondary'"
          :text="page.toString()"
          size="small"
          :class="{ 'active': page === currentPage }"
        />
      </template>

      <!-- Ellipsis if current page is not among the last few pages -->
      <span v-if="currentPage < totalPages - 2 && totalPages > 5" class="pagination-ellipsis">...</span>

      <!-- Last page -->
      <FormButton
        v-if="totalPages > 1"
        @click="handlePageChange(totalPages)"
        :variant="totalPages === currentPage ? 'primary' : 'secondary'"
        :text="totalPages.toString()"
        size="small"
        :class="{ 'active': totalPages === currentPage }"
      />
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

  // Always show pages around current page (up to 3)
  // But don't include first (1) or last page
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let i = start; i <= end; i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i)
    }
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
  align-items: center;
}

.pagination-ellipsis {
  padding: 0.375rem 0.25rem;
  color: #6c757d;
  display: flex;
  align-items: center;
}

.mt-3 {
  margin-top: 1rem;
}

/* Button sizing for both desktop and mobile */
.form-button--small {
  padding: 6px 12px;
  font-size: 12px;
  min-height: 30px;
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

  /* Make buttons display in a row on mobile */
  .pagination-pages {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    justify-content: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0;
  }
}
</style>