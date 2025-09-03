<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Safe Area Customization Test</h1>
      <p>Testing different safe area padding values</p>
    </div>

    <div class="content-body">
      <div class="card">
        <div class="card-body">
          <h2>Default Padding (1.5rem)</h2>
          <div class="safe-area-content">
            <p>This content uses the default safe area padding.</p>
          </div>
        </div>
      </div>

      <div class="card" style="--safe-area-padding: 1rem;">
        <div class="card-body">
          <h2>Small Padding (1rem)</h2>
          <div class="safe-area-content">
            <p>This content uses a smaller safe area padding.</p>
          </div>
        </div>
      </div>

      <div class="card" style="--safe-area-padding: 3rem;">
        <div class="card-body">
          <h2>Large Padding (3rem)</h2>
          <div class="safe-area-content">
            <p>This content uses a larger safe area padding.</p>
          </div>
        </div>
      </div>

      <div class="card custom-padding">
        <div class="card-body">
          <h2>Custom CSS Class Padding (2rem)</h2>
          <div class="safe-area-content">
            <p>This content uses padding defined in a custom CSS class.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// This component demonstrates how to customize safe area padding
</script>

<style scoped>
.page-container {
  width: 100%;
}

.page-header {
  background-color: var(--bg-light);
  border-radius: 0.5rem;
  padding: 1.5rem 2rem;
  border: 1px solid #e9ecef;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.page-header h1 {
  margin: 0;
  color: #495057;
  font-weight: 600;
  line-height: 1.3;
  font-size: 2rem;
}

.page-header p {
  margin: 0.5rem 0 0 0;
  color: #6c757d;
  font-size: 1rem;
  line-height: 1.4;
}

.content-body {
  padding: 1.5rem;
}

.card {
  margin-bottom: 1.5rem;
}

.custom-padding {
  --safe-area-padding: 2rem;
}
</style>