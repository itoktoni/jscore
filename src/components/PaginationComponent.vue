<template>
  <div v-if="totalPages > 1" class="pagination mt-3">
    <!-- Previous Button -->
    <Button
      button-type="button"
      @click="handlePageChange(currentPage - 1)"
      :disabled="currentPage <= 1"
      variant="secondary"
      text="Previous"
      size="small"
    />

    <!-- Page Numbers - Fixed structure: 1 first, 3 around current, 1 last -->
    <div class="pagination-pages">
      <!-- First page (1) -->
      <Button
        button-type="button"
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
        <Button
          button-type="button"
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
      <Button
        button-type="button"
        v-if="totalPages > 1"
        @click="handlePageChange(totalPages)"
        :variant="totalPages === currentPage ? 'primary' : 'secondary'"
        :text="totalPages.toString()"
        size="small"
        :class="{ 'active': totalPages === currentPage }"
      />
    </div>

    <!-- Next Button -->
    <Button
      button-type="button"
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
import Button from './Button.vue'

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