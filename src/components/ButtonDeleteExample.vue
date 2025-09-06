<template>
  <div class="button-delete-example">
    <h3>Button Component Examples</h3>

    <div class="example-section">
      <h4>Basic Delete Button</h4>
      <Button
        button-type="delete"
        url="/api/users/delete/{id}"
        text="Delete"
      />
    </div>

    <div class="example-section">
      <h4>Delete Button With Custom Text</h4>
      <Button
        button-type="delete"
        url="/api/users/delete/{id}"
        text="Remove User"
      />
    </div>

    <div class="example-section">
      <h4>Delete Button With Custom Styling</h4>
      <Button
        button-type="delete"
        url="/api/users/delete/{id}"
        button-class="btn btn-danger"
        text="Delete"
      />
    </div>

    <div class="example-section">
      <h4>Delete Button With Custom Confirmation Message</h4>
      <Button
        button-type="delete"
        url="/api/users/delete/{id}"
        confirm-message="Are you sure you want to remove this user? This action cannot be undone."
        text="Delete"
      />
    </div>

    <div class="example-section">
      <h4>Remove Button (Batch Delete)</h4>
      <Button
        button-type="remove"
        url="/api/users/delete"
        :selected-items="[1, 2, 3]"
        text="Delete Selected"
      />
    </div>

    <div class="example-section">
      <h4>Link Button</h4>
      <Button
        button-type="link"
        to="/users"
        text="Go to"
        link-text="User Management"
      />
    </div>

    <div class="example-section">
      <h4>Submit Button</h4>
      <Button
        button-type="submit"
        type="submit"
        variant="primary"
        text="Submit Form"
      />
    </div>

    <div class="example-section">
      <h4>Regular Button</h4>
      <Button
        button-type="button"
        variant="secondary"
        text="Click Me"
        @click="handleClick"
      />
    </div>
  </div>
</template>

<script setup>
// Import the new unified Button component
import Button from './Button.vue'

const handleClick = () => {
  console.log('Button clicked!')
}
</script>

<style scoped>
.button-delete-example {
  padding: 20px;
}

.example-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.example-section h4 {
  margin-top: 0;
}

.btn {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  color: #fff;
  background-color: #bb2d3b;
  border-color: #b02a37;
}
</style>