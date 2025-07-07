<template>
  <div class="app-container">
    <Title msg="OMS" />
    <div class="main-content">
      <nav class="main-nav">

        <div class="nav-title collapsible-title" @click="toggleManagement">
          Management
          <span :class="['collapse-icon', { 'rotated': isManagementOpen }]"></span>
        </div>
        <div v-show="isManagementOpen" class="collapsible-content">
          <RouterLink to="/users" class="nav-item">Users</RouterLink>
          <RouterLink to="/leaves" class="nav-item">Leave Requests</RouterLink>
          <RouterLink to="/departments" class="nav-item">Departments</RouterLink>
          <RouterLink to="/roles" class="nav-item">Roles</RouterLink>
        </div>

        <div class="nav-title collapsible-title" @click="toggleProject">
          Project
          <span :class="['collapse-icon', { 'rotated': isProjectOpen }]"></span>
        </div>
        <div v-show="isProjectOpen" class="collapsible-content">
          <RouterLink to="/projects" class="nav-item">Projects</RouterLink>
        </div>

      </nav>
      <div class="wrapper">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'; // Import ref for state management
import { RouterLink, RouterView } from 'vue-router';
import Title from './components/Title.vue';

// State variables to control the visibility of each section
const isManagementOpen = ref(true); // Start with Management section open by default
const isProjectOpen = ref(true);    // Start with Project section open by default

// Methods to toggle the state
const toggleManagement = () => {
  isManagementOpen.value = !isManagementOpen.value;
};

const toggleProject = () => {
  isProjectOpen.value = !isProjectOpen.value;
};
</script>

<style scoped>
/* Ensure you have the global.css import in main.ts as discussed */
html, body {
  margin: 0;
  padding: 0px 0px;
  font-family: Arial, sans-serif;
}
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f2f5;
  width: 100vw;
}

.main-content {
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
}

nav.main-nav {
  width: 180px;
  flex-shrink: 0;
  background-color: #34495e;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
}

/* --- Navigation Title Styles (Modified) --- */
.nav-title {
  color: #ffffff;
  font-size: 1.2em;
  font-weight: bold;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
}

/* --- New Styles for Collapsible Functionality --- */
.collapsible-title {
  cursor: pointer; /* Indicate it's clickable */
  display: flex; /* Use flex to align text and icon */
  justify-content: space-between; /* Space out text and icon */
  align-items: center; /* Vertically align them */
  padding-right: 0.5rem; /* Give space for the icon */
  /* Remove padding-bottom and margin-bottom from .nav-title
     if you want spacing controlled by .collapsible-content */
}

/* Optional: Remove border from .collapsible-title if you want it only on the main .nav-title */
.collapsible-title {
    /* If you want the line only once per section, consider making .nav-separator a line */
    /* border-bottom: none; */
}


.collapse-icon {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #ffffff; /* Down arrow */
  transition: transform 0.2s ease; /* Smooth rotation */
}

.collapse-icon.rotated {
  transform: rotate(-90deg); /* Rotate to point left when collapsed */
  border-top: 5px solid #ffffff; /* Ensure arrow color consistency */
}

.collapsible-content {
  /* You can add transition effects here for smooth collapse/expand */
  overflow: hidden; /* Hide overflow content during transition */
  /* max-height: 0; for v-if based transition (more complex) */
}

/* For v-show, simply changing display property works */
/* The v-show will toggle display: none / display: block */


/* Original Nav Item Styles (no changes needed here) */
.nav-item {
  display: block;
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  color: #ecf0f1;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-item:hover {
  background-color: #2c3e50;
  color: #ffffff;
}

.nav-item.router-link-active {
  background-color: #2980b9;
  font-weight: bold;
}

.nav-separator {
  margin: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  height: 0;
  display: block;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8em;
}

.wrapper {
  flex: 1;
  min-width: 0;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  margin: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow-y: auto;
}
</style>