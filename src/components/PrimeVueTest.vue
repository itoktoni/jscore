<template>
  <div class="card">
    <h2>PrimeVue Test</h2>
    <div class="p-4">
      <div class="mb-4">
        <h3>Button Components</h3>
        <Button label="Default" class="mr-2" />
        <Button label="Primary" severity="primary" class="mr-2" />
        <Button label="Secondary" severity="secondary" class="mr-2" />
        <Button label="Success" severity="success" class="mr-2" />
        <Button label="Info" severity="info" class="mr-2" />
        <Button label="Warning" severity="warning" class="mr-2" />
        <Button label="Danger" severity="danger" class="mr-2" />
        <Button label="Help" severity="help" class="mr-2" />
      </div>

      <div class="mb-4">
        <h3>Input Components</h3>
        <div class="flex flex-wrap gap-3 mb-3">
          <InputText v-model="textValue" placeholder="Text Input" />
          <InputNumber v-model="numberValue" placeholder="Number Input" />
        </div>
        <div class="flex flex-wrap gap-3 mb-3">
          <Textarea v-model="textareaValue" placeholder="Textarea" rows="3" cols="30" />
        </div>
      </div>

      <div class="mb-4">
        <h3>Panel Components</h3>
        <Accordion :multiple="true">
          <AccordionTab header="Header I">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </AccordionTab>
          <AccordionTab header="Header II">
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
          </AccordionTab>
        </Accordion>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const textValue = ref('')
const numberValue = ref(null)
const textareaValue = ref('')
</script>

<style scoped>
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem;
  margin: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mr-2 {
  margin-right: 0.5rem;
}
</style>