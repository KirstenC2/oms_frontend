<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Title from './components/Title.vue'
</script>

<template>
  <div class="app-container">
    <Title msg="OMS" />
    <div class="main-content">
      <nav>
        <RouterLink to="/users">Users</RouterLink>
        <RouterLink to="/departments">Departments</RouterLink>
        <RouterLink to="/roles">Roles</RouterLink>
      </nav>
      <div class="wrapper">
        <RouterView />
      </div>
    </div>
  </div>
</template>


<style scoped>
.main-content {
  display: flex;
  flex-direction: row;
  height: calc(100vh - /* Title 的高度 */ 60px); /* 可依需要調整 */
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Remove default margin and padding from html and body to eliminate outside blank space */
html, body {
  margin: 0 auto;
  padding: 0 auto;
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
  background: #58afc3;
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
  flex: 1; /* 撐滿剩餘空間 */
  padding: 2rem;
  border-radius: 8px;
  background-color: #3d546a;
  border-color: 1px #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto; /* 需要時讓內容可捲動 */
}

nav {
  width: 200px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  border-right: 1px solid #ddd;
}


nav a {
  padding: 10px 15px;
  margin-bottom: 10px;
  text-decoration: none;
  color: #333;
  border-radius: 4px;
  transition: background-color 0.2s;
}

</style>

