<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Title from './components/Title.vue'
</script>

<template>
  <div class="app-container">
    <Title msg="OMS" />
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/users">Users</RouterLink>
        <RouterLink to="/departments">Departments</RouterLink>
        <RouterLink to="/roles">Roles</RouterLink>
      </nav>
      <RouterView />
    </div>
  </div>
</template>


<style scoped>
/* Remove default margin and padding from html and body to eliminate outside blank space */
html, body {
  margin: 0;
  padding: 0;
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 90vw;
  min-height: 100vh;
  background: #b46464;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

h1 {
  color: #007bff; /* Change heading color */
  font-weight: bold;
  text-align: center;
}

h3 {
  color: #333;
  font-style: italic;
  text-align: center;
}

.greetings {
  background: #353a3f;
  padding: 2rem;
  border-radius: 8px;
}

.wrapper {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background: #353a3f;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

nav {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-bottom: 2rem;
}
</style>

