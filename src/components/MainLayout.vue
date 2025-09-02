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
              :class="{ 'active': $route.path === subItem.route }"
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

      <footer class="content-footer">
        <div class="grouped">
          <button class="button error">Kosongkan</button>
          <button class="button success">Buat</button>
          <button class="button primary">Sort</button>
        </div>
      </footer>
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
import { ref, onMounted, onUnmounted } from 'vue'
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

/* Custom styles for the layout */
.app-container {
  display: flex;
  background-color: var(--bg-secondary-color);
}

.sidebar-container {
  display: flex;
  width: 320px;
  background-color: var(--color-darkGrey);
  transition: transform 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 1000;
  transform: translateX(-100%);
}

.sidebar-container.open {
  transform: translateX(0);
}

.main-sidebar {
  width: 80px;
  background-color: var(--text-dark);
  display: flex;
  flex-direction: column;
}

.main-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  color: var(--color-lightGrey);
  text-decoration: none;
  border-bottom: 1px solid var(--color-darkGrey);
  transition: all 0.3s ease;
}

.nav-item:hover,
.nav-item.active {
  background-color: var(--color-primary);
  color: var(--text-light);
}

.nav-item i {
  font-size: 18px;
  margin-bottom: 5px;
}

.nav-item span {
  font-size: 12px;
  text-align: center;
}

.sub-menu-container {
  width: 240px;
  background-color: var(--color-darkGrey);
  padding: 20px;
  overflow-y: auto;
}

.logo {
  display: block;
  text-align: center;
  margin-bottom: 30px;
  text-decoration: none;
}

.logo h1 {
  margin: 0;
  color: var(--text-light);
}

.sub-menu-list {
  display: flex;
  flex-direction: column;
}

.sub-menu-list a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  color: var(--color-lightGrey);
  text-decoration: none;
  border-radius: 4px;
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

.sub-menu-list a:hover,
.sub-menu-list a.active {
  background-color: var(--color-primary);
  color: var(--text-light);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 0;
  transition: margin-left 0.3s ease;
}

.main-header {
  background-color: var(--bg-color);
  padding: 15px 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title-wrapper {
  gap: 15px;
}

.mobile-menu-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--color-darkGrey);
}

.header-title {
  margin: 0;
  color: var(--color-darkGrey);
  font-size: 20px;
}

.user-profile {
  gap: 15px;
}

.notification-icon,
.profile-icon {
  position: relative;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.notification-icon:hover,
.profile-icon:hover {
  background-color: var(--bg-secondary-color);
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--color-error);
  color: var(--text-light);
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--bg-color);
  border: 1px solid var(--color-lightGrey);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  min-width: 150px;
  z-index: 1001;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.profile-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 10px 15px;
  color: var(--font-color);
  text-decoration: none;
  border-bottom: 1px solid var(--border-color);
}

.dropdown-item:hover {
  background-color: var(--bg-secondary-color);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.content-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.content-footer {
  background-color: var(--bg-color);
  padding: 15px 20px;
  border-top: 1px solid var(--color-lightGrey);
  display: flex;
  justify-content: flex-end;
}

.notification-drawer {
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background-color: var(--bg-color);
  box-shadow: -4px 0 12px rgba(0,0,0,0.15);
  z-index: 1002;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.notification-drawer.open {
  transform: translateX(0);
}

.notification-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-title {
  margin: 0;
  color: var(--color-darkGrey);
}

.notification-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-muted);
}

.notification-list {
  flex: 1;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.3s ease;
}

.notification-item.unread {
  background-color: var(--notification-unread-bg);
  border-left: 3px solid var(--color-primary);
}

.notification-item:hover {
  background-color: var(--bg-secondary-color);
}

.notification-icon-small {
  margin-right: 15px;
  color: var(--color-primary);
}

.notification-content {
  flex: 1;
}

.notification-message {
  margin: 0 0 5px 0;
  color: var(--font-color);
  font-size: 14px;
  line-height: 1.4;
}

.notification-time {
  color: var(--text-muted);
  font-size: 12px;
  margin-bottom: 8px;
}

.notification-actions {
  display: flex;
  gap: 10px;
}

.notification-action {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
}

.notification-footer {
  padding: 15px 20px;
  border-top: 1px solid var(--border-color);
}

.mark-all-read {
  width: 100%;
  background-color: var(--color-primary);
  color: var(--text-light);
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.mark-all-read:hover {
  background-color: var(--primary-hover);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.overlay.active {
  opacity: 1;
  visibility: visible;
}

/* Desktop styles */
@media (min-width: 769px) {
  .sidebar-container {
    position: static;
    transform: translateX(0);
  }

  .main-content {
    margin-left: 320px;
  }

  .mobile-menu-button {
    display: none;
  }

  .overlay {
    display: none;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .notification-drawer {
    width: 100%;
    max-width: 400px;
  }

  .content-footer {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 16px;
  }

  .content-body {
    padding: 15px;
  }

  .content-footer {
    padding: 10px 15px;
  }
}
</style>