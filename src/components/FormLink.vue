/**
 * FormLink Component
 *
 * Reusable navigation link component for forms with consistent styling
 */

<template>
  <div class="form-link">
    <p>
      {{ text }}
      <router-link :to="to" class="link">
        {{ linkText }}
      </router-link>
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  linkText: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.form-link {
  text-align: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.form-link p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

/* Mobile optimizations */
@media (max-width: 480px) {
  .form-link {
    margin-top: 15px;
    padding-top: 12px;
  }

  .form-link p {
    font-size: 13px;
  }
}
</style>