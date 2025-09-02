/**
 * Main Layout Component
 *
 * Admin dashboard layout with sidebar navigation using Chota CSS framework
 */

<template>
  <div class="app-container is-full-screen">
    <!-- Sidebar Container for both columns -->
    <div id="sidebar-container" class="sidebar-container" :class="{ 'open': sidebarOpen }">
      <!-- Column 1: Main Sidebar -->
      <aside class="main-sidebar">
        <ul class="main-nav">
          <li v-for="(item, index) in mainNavItems" :key="index">
            <a href="#"
               class="nav-item"
               :class="{ 'active': selectedMenu === item.id }"
               :data-menu="item.id"
               @click.prevent="selectMenu(item.id)">
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </a>
          </li>
        </ul>
      </aside>

      <!-- Column 2: Sub Menu -->
      <div id="sub-menu-container" class="sub-menu-container">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <h1>
            <img src="/assets/images/logo.png" alt="logo" style="max-height: 40px;">
          </h1>
        </router-link>

        <!-- Dynamic Sub Menus -->
        <div
          v-for="(menu, menuId) in subMenus"
          :key="menuId"
          class="sub-menu"
          :id="`${menuId}-submenu`"
          :style="{ display: selectedMenu === menuId ? 'block' : 'none' }"
        >
          <div class="sub-menu-list">
            <router-link
              v-for="(subItem, index) in menu"
              :key="index"
              :to="subItem.route"
              :class="{ 'active': isRouteActive(subItem.route) }"
            >
              <span>{{ subItem.title }}</span>
              <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Column 3: Main Content -->
    <main class="main-content">
      <header class="main-header">
        <div class="header-title-wrapper is-vertical-align">
          <button
            id="mobile-menu-button"
            class="mobile-menu-button"
            @click="toggleSidebar"
          >
            <i class="bi bi-sliders"></i>
          </button>
          <h1 class="header-title">OBSESIMAN REPORT</h1>
        </div>
        <div class="user-profile is-vertical-align">
          <div
            class="notification-icon"
            id="notification-icon"
            @click="toggleNotifications"
          >
            <i class="bi bi-bell"></i>
            <span v-if="notificationCount > 0" class="notification-badge">{{ notificationCount }}</span>
          </div>

          <div class="profile-icon" id="profile-icon" @click="toggleProfileDropdown">
            <i class="bi bi-person-badge"></i>
            <div
              class="profile-dropdown"
              id="profile-dropdown"
              :class="{ 'active': showProfileDropdown }"
            >
              <router-link to="/profile" class="dropdown-item">Profile</router-link>
              <router-link to="/settings" class="dropdown-item">Settings</router-link>
              <a href="#" class="dropdown-item" @click.prevent="logout">Logout</a>
            </div>
          </div>
        </div>
      </header>

      <div class="content-body">
        <!-- Router View for Page Content -->
        <router-view />
      </div>


    </main>
  </div>

  <!-- Notification Drawer -->
  <div
    class="notification-drawer"
    id="notification-drawer"
    :class="{ 'open': showNotifications }"
  >
    <div class="notification-header">
      <h2 class="notification-title">Notifications</h2>
      <button class="notification-close" @click="closeNotifications">×</button>
    </div>
    <div class="notification-list is-paddingless">
      <div
        v-for="(notification, index) in notifications"
        :key="index"
        class="notification-item"
        :class="{ 'unread': !notification.read }"
      >
        <div class="notification-icon-small">
          <i :class="notification.icon"></i>
        </div>
        <div class="notification-content">
          <p class="notification-message">{{ notification.message }}</p>
          <div class="notification-time">{{ notification.time }}</div>
          <div class="notification-actions">
            <button class="notification-action" @click="markAsRead(index)">Mark as read</button>
            <button class="notification-action" @click="dismissNotification(index)">Dismiss</button>
          </div>
        </div>
      </div>
    </div>
    <div class="notification-footer">
      <button class="mark-all-read" @click="markAllAsRead">Mark all as read</button>
    </div>
  </div>

  <div
    id="overlay"
    class="overlay"
    :class="{ 'active': sidebarOpen || showNotifications }"
    @click="closeOverlays"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Reactive state
const sidebarOpen = ref(false)
const showNotifications = ref(false)
const showProfileDropdown = ref(false)
const selectedMenu = ref('system')
const notificationCount = ref(3)

// Menu configuration
const mainNavItems = ref([
  { id: 'home', title: 'Home', icon: 'bi bi-house' },
  { id: 'aplikasi', title: 'Aplikasi', icon: 'bi bi-house' },
  { id: 'laporan', title: 'Laporan', icon: 'bi bi-house' },
  { id: 'system', title: 'System', icon: 'bi bi-house' }
])

const subMenus = ref({
  home: [
    { title: 'Dashboard', route: '/dashboard' },
    { title: 'Analytics', route: '/analytics' },
    { title: 'Reports', route: '/reports' }
  ],
  aplikasi: [
    { title: 'App List', route: '/apps' },
    { title: 'New App', route: '/apps/new' },
    { title: 'Settings', route: '/apps/settings' }
  ],
  laporan: [
    { title: 'Sales Report', route: '/reports/sales' },
    { title: 'User Report', route: '/reports/users' },
    { title: 'Financials', route: '/reports/financials' }
  ],
  system: [
    { title: 'Group', route: '/system/groups' },
    { title: 'Roles', route: '/system/roles' },
    { title: 'Menu', route: '/system/menu' },
    { title: 'Link', route: '/system/links' },
    { title: 'Permission', route: '/system/permissions' },
    { title: 'Setting Website', route: '/system/settings' },
    { title: 'User', route: '/users' }
  ]
})

const notifications = ref([
  {
    icon: 'bi bi-person-circle',
    message: "A new user 'john_doe' has registered to the system.",
    time: '10 minutes ago',
    read: false
  },
  {
    icon: 'bi bi-bell',
    message: 'Your monthly sales report has been successfully generated.',
    time: '1 hour ago',
    read: false
  },
  {
    icon: 'bi bi-bell',
    message: 'A new system update is available. Please update at your convenience.',
    time: '2 hours ago',
    read: true
  },
  {
    icon: 'bi bi-bell',
    message: 'A payment of $250.00 has been received from Customer Inc.',
    time: '5 hours ago',
    read: true
  }
])

// Methods
const isRouteActive = (route) => {
  // For exact match on root paths
  if (route === '/' || route === '/dashboard') {
    return router.currentRoute.value.path === route
  }
  
  // For nested routes (like /users, /users/create, /users/:id/edit)
  // Check if current path starts with the menu route
  return router.currentRoute.value.path.startsWith(route)
}

const selectMenu = (menuId) => {
  selectedMenu.value = menuId
  if (window.innerWidth <= 768) {
    sidebarOpen.value = false
  }
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showProfileDropdown.value = false
}

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
  showNotifications.value = false
}

const closeNotifications = () => {
  showNotifications.value = false
}

const closeOverlays = () => {
  sidebarOpen.value = false
  showNotifications.value = false
  showProfileDropdown.value = false
}

const markAsRead = (index) => {
  notifications.value[index].read = true
  updateNotificationCount()
}

const dismissNotification = (index) => {
  notifications.value.splice(index, 1)
  updateNotificationCount()
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
  updateNotificationCount()
}

const updateNotificationCount = () => {
  notificationCount.value = notifications.value.filter(n => !n.read).length
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Set the active menu based on current route
const setActiveMenuFromRoute = () => {
  const currentPath = router.currentRoute.value.path
  
  // Check which main menu should be active based on current route
  for (const [menuId, subMenuItems] of Object.entries(subMenus.value)) {
    for (const subItem of subMenuItems) {
      if (currentPath.startsWith(subItem.route) && subItem.route !== '/') {
        selectedMenu.value = menuId
        return
      }
    }
  }
}

const handleResize = () => {
  if (window.innerWidth > 768) {
    sidebarOpen.value = false
  }
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.profile-icon')) {
    showProfileDropdown.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)
  updateNotificationCount()
  // Set active menu based on current route
  setActiveMenuFromRoute()
})

// Watch for route changes and update active menu
watch(() => router.currentRoute.value.path, () => {
  setActiveMenuFromRoute()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style>
/* Import local Chota CSS and Bootstrap Icons */
@import url('../assets/css/chota.css');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css');
</style>