/**
 * System Settings Page
 *
 * Example page demonstrating the table structure from the original layout
 */

<template>
    <div class="card">
      <div class="row">
        <div class="col">
          <p class="grouped">
            <label for="search-select">Search</label>
            <select name="search" id="search-select" v-model="searchType">
              <option value="">Masukan 1</option>
              <option value="option2">Masukan 2</option>
            </select>
          </p>
        </div>

        <div class="col">
          <p class="grouped">
            <label for="filter-input">Filter</label>
            <input
              type="search"
              name="filter"
              id="filter-input"
              placeholder="Search"
              v-model="filterText"
            >
            <button class="button icon-only" @click="handleSearch">
              <img src="https://icongr.am/feather/search.svg?size=16" alt="Search">
            </button>
          </p>
        </div>
      </div>

      <hr class="hr">

      <table class="data-table striped">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleSelectAll"
              >
            </th>
            <th class="action-header text-center">Aksi</th>
            <th>Kode</th>
            <th>Nama</th>
            <th>Icon</th>
            <th>Url</th>
            <th>Sort</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredData" :key="index">
            <td>
              <input
                type="checkbox"
                v-model="item.selected"
                @change="updateSelectAll"
              >
            </td>
            <td class="column-action">
              <div class="action-table">
                <button class="button primary" @click="editItem(item)" title="Edit">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="button error" @click="deleteItem(item)" title="Delete">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
            <td>{{ item.code }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.icon }}</td>
            <td>{{ item.url }}</td>
            <td>{{ item.sort }}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive data
const searchType = ref('')
const filterText = ref('')
const selectAll = ref(false)

// Sample data
const tableData = ref([
  {
    code: 'aplikasi',
    name: 'Aplikasi',
    icon: 'window-sidebar',
    url: '',
    sort: 2,
    selected: false
  },
  {
    code: 'laporan',
    name: 'Laporan',
    icon: 'printer',
    url: '',
    sort: 1,
    selected: false
  },
  {
    code: 'master table yang panjang banget jadi harus di break down',
    name: 'Master',
    icon: 'database',
    url: '',
    sort: 7,
    selected: false
  },
  {
    code: 'system',
    name: 'System',
    icon: 'gear',
    url: '',
    sort: 3,
    selected: false
  },
  {
    code: 'users',
    name: 'Users',
    icon: 'people',
    url: '/users',
    sort: 4,
    selected: false
  }
])

// Computed properties
const filteredData = computed(() => {
  if (!filterText.value) {
    return tableData.value
  }

  const filter = filterText.value.toLowerCase()
  return tableData.value.filter(item =>
    item.code.toLowerCase().includes(filter) ||
    item.name.toLowerCase().includes(filter) ||
    item.icon.toLowerCase().includes(filter)
  )
})

// Methods
const handleSearch = () => {
  console.log('Searching with:', {
    searchType: searchType.value,
    filterText: filterText.value
  })
}

const toggleSelectAll = () => {
  tableData.value.forEach(item => {
    item.selected = selectAll.value
  })
}

const updateSelectAll = () => {
  const selectedItems = tableData.value.filter(item => item.selected)
  selectAll.value = selectedItems.length === tableData.value.length
}

const editItem = (item) => {
  console.log('Editing item:', item)
  // Add edit logic here
}

const deleteItem = (item) => {
  console.log('Deleting item:', item)
  // Add delete logic here
  const index = tableData.value.indexOf(item)
  if (index > -1) {
    tableData.value.splice(index, 1)
  }
}

// Add data labels for mobile responsiveness
const addDataLabelsToTable = () => {
  const table = document.querySelector('.data-table')
  if (!table) return

  const headers = Array.from(table.querySelectorAll('thead th'))
  const rows = table.querySelectorAll('tbody tr')

  rows.forEach(row => {
    const cells = row.querySelectorAll('td')
    cells.forEach((cell, index) => {
      if (headers[index]) {
        const headerText = headers[index].textContent.trim()
        if (headerText !== '' && !headerText.includes('checkbox')) {
          cell.setAttribute('data-label', headerText)
        }
      }
    })
  })
}

onMounted(() => {
  addDataLabelsToTable()
})
</script>

<style scoped>
.system-settings-page {
  padding: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.col {
  flex: 1;
}

.grouped {
  margin: 0;
}

.grouped label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.grouped select,
.grouped input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.grouped input[type="search"] {
  width: calc(100% - 50px);
  display: inline-block;
  margin-right: 10px;
}

.button.icon-only {
  width: 40px;
  height: 40px;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 20px 0;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: 500;
  color: #333;
}

.data-table.striped tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.action-header {
  width: 120px;
}

.column-action {
  text-align: center;
}

.action-table {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.action-table .button {
  padding: 6px 10px;
  font-size: 12px;
  min-width: auto;
}

.text-center {
  text-align: center;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .row {
    flex-direction: column;
    gap: 15px;
  }

  .data-table,
  .data-table thead,
  .data-table tbody,
  .data-table th,
  .data-table td,
  .data-table tr {
    display: block;
  }

  .data-table thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  .data-table tr {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    background: white;
  }

  .data-table td {
    border: none;
    position: relative;
    padding: 8px 8px 8px 35%;
    min-height: 30px;
    border-bottom: 1px solid #eee;
  }

  .data-table td:before {
    content: attr(data-label) ":";
    position: absolute;
    left: 8px;
    width: 30%;
    font-weight: bold;
    color: #333;
  }

  .data-table td:last-child {
    border-bottom: none;
  }

  .action-table {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .system-settings-page {
    padding: 10px;
  }

  .card {
    padding: 15px;
  }

  .grouped input[type="search"] {
    width: calc(100% - 45px);
  }

  .button.icon-only {
    width: 35px;
    height: 35px;
  }
}
</style>