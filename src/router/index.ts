import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserView from '../views/UserView.vue'
import LeaveView from '@/views/LeaveView.vue'
import LeaveDetailsPage from '@/modules/leaves/views/LeaveDetailsPage.vue' // Import the new LeaveDetailsPage component
import ProjectView from '@/modules/projects/views/ProjectView.vue'
import CreateTaskPage from '@/modules/projects/views/CreateTaskPage.vue'
import ProjectBoardPage from '@/modules/projects/views/ProjectBoardPage.vue'
import ProjectDiagramPage from '@/modules/projects/views/ProjectDiagramPage.vue'
import ClientView from '@/modules/crm/views/ClientView.vue'
import VendorView from '@/modules/crm/views/VendorView.vue'
import QuotationView from '@/modules/quotations/views/QuotationView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'), // Make sure AboutView.vue exists in ../views/
    },
    {
      path: '/users',
      name: 'users',
      component: UserView,
    },
    {
      path: '/leaves',
      name: 'leaves',
      component: LeaveView,
    },
     // The new route for individual leave details
    {
      path: '/leaves/:id', // `:id` is a route parameter that will capture the leave ID
      name: 'leave-details',
      component: LeaveDetailsPage,
      props: true, // This is crucial: it passes the `id` route parameter as a prop to LeaveDetailsPage
    },
    {
      path: '/departments',
      name: 'departments',
      component: () => import('../views/DepartmentView.vue'),
    },
    {
      path: '/roles',
      name: 'roles',
      component: () => import('../views/RoleView.vue'),
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectView,
      props: true, 
    },
    {
      path: '/projects/:id', // `:id` is a route parameter that will capture the leave ID
      name: 'project-details',
      component: ProjectBoardPage, // Ensure this component exists
      props: true, // This is crucial: it passes the `id` route parameter as a prop to LeaveDetailsPage
    },
    {
      path: '/projects/diagram/:id', // `:id` is a route parameter that will capture the leave ID
      name: 'project-diagram',
      component: ProjectDiagramPage, // Ensure this component exists
      props: true, // This is crucial: it passes the `id` route parameter as a prop to LeaveDetailsPage
    },
    {
      path: '/create-tasks',
      name: 'tasks',
      component: CreateTaskPage,
    },
    {
      path: '/clients',
      name: 'clients',
      component: ClientView,
    },
    {
      path: '/vendors',
      name: 'vendors',
      component: VendorView,
    },
    {
      path: '/quotations',
      name: 'quotations',
      component: QuotationView,
    },
  ],
})

export default router
