<template>
  <div class="plugin-section">
    <h2>Filesystem</h2>
    <div class="plugin-content">
      <p><strong>File Operations:</strong></p>
      <div class="form-group">
        <label for="fileName">File Name:</label>
        <input id="fileName" v-model="fileName" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label for="fileContent">File Content:</label>
        <textarea id="fileContent" v-model="fileContent" class="form-control" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label for="directory">Directory:</label>
        <select id="directory" v-model="selectedDirectory" class="form-control">
          <option value="DOCUMENTS">Documents</option>
          <option value="DATA">Data</option>
          <option value="CACHE">Cache</option>
          <option value="EXTERNAL">External</option>
        </select>
      </div>
      <div v-if="fileResult">
        <p><strong>Result:</strong> {{ fileResult }}</p>
      </div>
      <div v-if="fileContentResult">
        <p><strong>File Content:</strong> {{ fileContentResult }}</p>
      </div>
      <div v-if="fileError">
        <p><strong>Error:</strong> {{ fileError }}</p>
      </div>
      <div v-if="!isNative">
        <p><strong>Note:</strong> Filesystem plugin only works on native platforms (Android/iOS).</p>
      </div>
      <button class="button primary" @click="writeFile" :disabled="!isNative">Write File</button>
      <button class="button secondary" @click="readFile" :disabled="!isNative">Read File</button>
      <button class="button secondary" @click="deleteFile" :disabled="!isNative">Delete File</button>
      <button class="button secondary" @click="listFiles" :disabled="!isNative">List Files</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Capacitor } from '@capacitor/core'

// Reactive data
const fileName = ref('test.txt')
const fileContent = ref('This is test content from Capacitor Filesystem')
const selectedDirectory = ref('DOCUMENTS')
const fileResult = ref('')
const fileContentResult = ref('')
const fileError = ref('')
const isNative = ref(false)

// Check if we're on a native platform
isNative.value = Capacitor.isNativePlatform()

// Import the plugin directly (this should work with ES modules)
import { Filesystem, Directory } from '@capacitor/filesystem'

// Filesystem Plugin
const writeFile = async () => {
  try {
    fileError.value = ''
    fileResult.value = ''
    fileContentResult.value = ''

    // Check if the filename contains a directory path
    const pathParts = fileName.value.split('/')
    if (pathParts.length > 1) {
      // If it's a path, we need to ensure the directory exists
      const directoryPath = pathParts.slice(0, -1).join('/')
      try {
        // Try to create the directory (recursive creation)
        await Filesystem.mkdir({
          path: directoryPath,
          directory: Directory[selectedDirectory.value],
          recursive: true
        })
      } catch (mkdirError) {
        // Directory might already exist, which is fine
        console.log('Directory creation skipped (may already exist):', mkdirError)
      }
    }

    const result = await Filesystem.writeFile({
      path: fileName.value,
      data: fileContent.value,
      directory: Directory[selectedDirectory.value],
      encoding: 'utf8'
    })
    fileResult.value = `File written: ${result.uri}`
    console.log('File written:', result)
  } catch (error) {
    console.error('Error writing file:', error)
    fileError.value = error.message || 'Unknown error occurred'
  }
}

const readFile = async () => {
  try {
    fileError.value = ''
    fileContentResult.value = ''
    const result = await Filesystem.readFile({
      path: fileName.value,
      directory: Directory[selectedDirectory.value],
      encoding: 'utf8'
    })
    fileContentResult.value = result.data
    fileResult.value = 'File read successfully'
    console.log('File read:', result)
  } catch (error) {
    console.error('Error reading file:', error)
    fileError.value = error.message || 'Unknown error occurred'
  }
}

const deleteFile = async () => {
  try {
    fileError.value = ''
    await Filesystem.deleteFile({
      path: fileName.value,
      directory: Directory[selectedDirectory.value]
    })
    fileResult.value = 'File deleted successfully'
    fileContentResult.value = ''
    console.log('File deleted')
  } catch (error) {
    console.error('Error deleting file:', error)
    fileError.value = error.message || 'Unknown error occurred'
  }
}

const listFiles = async () => {
  try {
    fileError.value = ''
    const result = await Filesystem.readdir({
      path: '',
      directory: Directory[selectedDirectory.value]
    })
    fileResult.value = `Files found: ${result.files.length}`
    console.log('Files listed:', result)
  } catch (error) {
    console.error('Error listing files:', error)
    fileError.value = error.message || 'Unknown error occurred'
  }
}
</script>

<style scoped>
.plugin-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
}

.plugin-section h2 {
  margin-top: 0;
  color: #333;
}

.plugin-content {
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>