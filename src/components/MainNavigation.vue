<template>
  <nav class="main-navigation">
    <div class="nav-container">
      <!-- Logo/Brand -->
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-icon">🔐</span>
          <span class="brand-text">AuthApp</span>
        </router-link>
      </div>

      <!-- Navigation Links -->
      <div class="nav-links" v-if="authStore.isAuthenticated">
        <router-link
          to="/profile"
          class="nav-link"
          :class="{ active: $route.name === 'Profile' }"
        >
          <span class="nav-icon">👤</span>
          <span class="nav-text">Profile</span>
        </router-link>

        <router-link
          v-if="authStore.canManageUsers"
          to="/users"
          class="nav-link"
          :class="{ active: $route.name === 'UserManagement' }"
        >
          <span class="nav-icon">👥</span>
          <span class="nav-text">User Management</span>
        </router-link>
      </div>

      <!-- User Menu -->
      <div class="nav-user" v-if="authStore.isAuthenticated">
        <div class="user-info" @click="toggleUserMenu">
          <div class="user-avatar">
            {{ getUserInitials() }}
          </div>
          <div class="user-details">
            <span class="user-name">{{ authStore.user?.name || authStore.user?.username }}</span>
            <span class="user-role" v-if="authStore.user?.role">{{ formatRole(authStore.user.role) }}</span>
          </div>
          <span class="dropdown-arrow" :class="{ rotated: showUserMenu }">▼</span>
        </div>

        <!-- User Dropdown Menu -->
        <div v-if="showUserMenu" class="user-menu" @click.stop>
          <div class="menu-item" @click="goToProfile">
            <span class="menu-icon">👤</span>
            <span class="menu-text">My Profile</span>
          </div>

          <div
            v-if="authStore.canManageUsers"
            class="menu-item"
            @click="goToUserManagement"
          >
            <span class="menu-icon">👥</span>
            <span class="menu-text">Manage Users</span>
          </div>

          <div class="menu-divider"></div>

          <div class="menu-item logout" @click="handleLogout">
            <span class="menu-icon">🚪</span>
            <span class="menu-text">Logout</span>
          </div>
        </div>
      </div>

      <!-- Login Button for unauthenticated users -->
      <div class="nav-auth" v-else>
        <router-link to="/login" class="login-button">
          Login
        </router-link>
      </div>
    </div>

    <!-- Mobile Menu Toggle -->
    <div class="mobile-menu-toggle" @click="toggleMobileMenu" v-if="authStore.isAuthenticated">
      <span class="hamburger" :class="{ active: showMobileMenu }"></span>
    </div>

    <!-- Mobile Menu -->
    <div v-if="showMobileMenu && authStore.isAuthenticated" class="mobile-menu">
      <router-link
        to="/profile"
        class="mobile-nav-link"
        @click="closeMobileMenu"
      >
        <span class="nav-icon">👤</span>
        Profile
      </router-link>

      <router-link
        v-if="authStore.canManageUsers"
        to="/users"
        class="mobile-nav-link"
        @click="closeMobileMenu"
      >
        <span class="nav-icon">👥</span>
        User Management
      </router-link>

      <div class="mobile-menu-divider"></div>

      <button @click="handleLogout" class="mobile-logout-button">
        <span class="nav-icon">🚪</span>
        Logout
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)

// Methods
const getUserInitials = () => {
  const user = authStore.user
  if (!user) return '?'

  const name = user.name || user.username || '?'
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

const formatRole = (role) => {
  if (!role) return ''
  return role.charAt(0).toUpperCase() + role.slice(1)
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const goToProfile = () => {
  router.push('/profile')
  showUserMenu.value = false
}

const goToUserManagement = () => {
  router.push('/users')
  showUserMenu.value = false
}

const handleLogout = async () => {
  await authStore.logout()
  showUserMenu.value = false
  showMobileMenu.value = false
  router.push('/login')
}

// Close menus when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.nav-user')) {
    showUserMenu.value = false
  }
  if (!event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-toggle')) {
    showMobileMenu.value = false
  }
}

// Handle escape key
const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    showUserMenu.value = false
    showMobileMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<style scoped>
.main-navigation {
  background-color: #fff;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

/* Brand */
.nav-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-weight: 600;
  font-size: 18px;
}

.brand-icon {
  font-size: 24px;
  margin-right: 8px;
}

.brand-text {
  color: #007bff;
}

/* Navigation Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #666;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
  font-weight: 500;
}

.nav-link:hover {
  color: #007bff;
  background-color: #f8f9fa;
}

.nav-link.active {
  color: #007bff;
  background-color: #e3f2fd;
}

.nav-icon {
  margin-right: 6px;
  font-size: 16px;
}

/* User Menu */
.nav-user {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f8f9fa;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  margin-right: 10px;
}

.user-details {
  display: flex;
  flex-direction: column;
  margin-right: 8px;
}

.user-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: #666;
  text-transform: capitalize;
}

.dropdown-arrow {
  font-size: 10px;
  color: #666;
  transition: transform 0.3s;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1001;
  margin-top: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-bottom: 1px solid #f8f9fa;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background-color: #f8f9fa;
}

.menu-item.logout:hover {
  background-color: #fff5f5;
  color: #dc3545;
}

.menu-icon {
  margin-right: 10px;
  font-size: 14px;
}

.menu-text {
  font-size: 14px;
  font-weight: 500;
}

.menu-divider {
  height: 1px;
  background-color: #e9ecef;
  margin: 4px 0;
}

/* Login Button */
.login-button {
  background-color: #007bff;
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #0056b3;
}

/* Mobile Menu */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 4px;
}

.hamburger {
  width: 24px;
  height: 2px;
  background-color: #333;
  transition: all 0.3s;
  position: relative;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: #333;
  transition: all 0.3s;
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}

.hamburger.active {
  background-color: transparent;
}

.hamburger.active::before {
  transform: rotate(45deg);
  top: 0;
}

.hamburger.active::after {
  transform: rotate(-45deg);
  bottom: 0;
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 20px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  padding: 12px 0;
  border-bottom: 1px solid #f8f9fa;
  font-weight: 500;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

.mobile-menu-divider {
  height: 1px;
  background-color: #e9ecef;
  margin: 16px 0;
}

.mobile-logout-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #dc3545;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }

  .user-details {
    display: none;
  }

  .nav-container {
    padding: 0 15px;
  }
}

@media (max-width: 480px) {
  .brand-text {
    display: none;
  }

  .nav-container {
    padding: 0 10px;
  }
}
</style>