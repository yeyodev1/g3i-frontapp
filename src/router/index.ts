import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { site } from '@/config/site'

const publicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: site.name },
  },
  {
    path: '/propiedades',
    name: 'Properties',
    component: () => import('@/views/PropertiesView.vue'),
    meta: { title: 'Propiedades en venta' },
  },
  {
    path: '/propiedades/:slug',
    name: 'PropertyDetail',
    component: () => import('@/views/PropertyDetailView.vue'),
    meta: { title: 'Propiedad' },
  },
  {
    path: '/proyectos',
    name: 'Projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: { title: 'Proyectos inmobiliarios' },
  },
  {
    path: '/proyectos/:slug',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetailView.vue'),
    meta: { title: 'Proyecto' },
  },
  {
    path: '/proyectos/:slug/unidades/:unitId',
    name: 'UnitDetail',
    component: () => import('@/views/UnitDetailView.vue'),
    meta: { title: 'Unidad disponible' },
  },
  {
    path: '/mapa',
    name: 'Map',
    component: () => import('@/views/MapView.vue'),
    meta: { title: 'Buscar en el mapa' },
  },
  {
    path: '/vender-mi-propiedad',
    name: 'Sell',
    component: () => import('@/views/SellView.vue'),
    meta: { title: 'Vender mi propiedad' },
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('@/views/BlogView.vue'),
    meta: { title: 'Blog' },
  },
  {
    path: '/blog/:slug',
    name: 'Post',
    component: () => import('@/views/PostView.vue'),
    meta: { title: 'Blog' },
  },
  {
    path: '/preguntas-frecuentes',
    name: 'Faq',
    component: () => import('@/views/FaqView.vue'),
    meta: { title: 'Preguntas frecuentes' },
  },
  {
    path: '/conocenos',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'Conócenos' },
  },
  {
    path: '/contacto',
    name: 'Contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { title: 'Contacto' },
  },
]

// Portal de la inmobiliaria: layout propio, sin header ni footer públicos.
const admin = { layout: 'admin', requiresAuth: true, requiresAdmin: true }

const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: '/admin/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Ingresar al portal', guestOnly: true, layout: 'bare' },
  },
  { path: '/login', redirect: '/admin/login' },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/AdminDashboardView.vue'),
    meta: { ...admin, title: 'Portal' },
  },
  {
    path: '/admin/propiedades',
    name: 'AdminProperties',
    component: () => import('@/views/admin/AdminPropertiesView.vue'),
    meta: { ...admin, title: 'Propiedades' },
  },
  {
    path: '/admin/propiedades/nueva',
    name: 'AdminPropertyNew',
    component: () => import('@/views/admin/AdminPropertyEditView.vue'),
    meta: { ...admin, title: 'Nueva propiedad' },
  },
  {
    path: '/admin/propiedades/:id',
    name: 'AdminPropertyEdit',
    component: () => import('@/views/admin/AdminPropertyEditView.vue'),
    meta: { ...admin, title: 'Editar propiedad' },
  },
  {
    path: '/admin/proyectos',
    name: 'AdminProjects',
    component: () => import('@/views/admin/AdminProjectsView.vue'),
    meta: { ...admin, title: 'Proyectos' },
  },
  {
    path: '/admin/proyectos/nuevo',
    name: 'AdminProjectNew',
    component: () => import('@/views/admin/AdminProjectEditView.vue'),
    meta: { ...admin, title: 'Nuevo proyecto' },
  },
  {
    path: '/admin/proyectos/:id',
    name: 'AdminProjectEdit',
    component: () => import('@/views/admin/AdminProjectEditView.vue'),
    meta: { ...admin, title: 'Editar proyecto' },
  },
  {
    path: '/admin/proyectos/:id/unidades',
    name: 'AdminUnits',
    component: () => import('@/views/admin/AdminUnitsView.vue'),
    meta: { ...admin, title: 'Inventario del proyecto' },
  },
  {
    path: '/admin/blog',
    name: 'AdminPosts',
    component: () => import('@/views/admin/AdminPostsView.vue'),
    meta: { ...admin, title: 'Blog' },
  },
  {
    path: '/admin/blog/nuevo',
    name: 'AdminPostNew',
    component: () => import('@/views/admin/AdminPostEditView.vue'),
    meta: { ...admin, title: 'Nueva entrada' },
  },
  {
    path: '/admin/blog/:id',
    name: 'AdminPostEdit',
    component: () => import('@/views/admin/AdminPostEditView.vue'),
    meta: { ...admin, title: 'Editar entrada' },
  },
  {
    path: '/admin/preguntas',
    name: 'AdminFaqs',
    component: () => import('@/views/admin/AdminFaqsView.vue'),
    meta: { ...admin, title: 'Preguntas frecuentes' },
  },
  {
    path: '/admin/asesores',
    name: 'AdminAdvisors',
    component: () => import('@/views/admin/AdminAdvisorsView.vue'),
    meta: { ...admin, title: 'Asesores' },
  },
  {
    path: '/admin/testimonios',
    name: 'AdminTestimonials',
    component: () => import('@/views/admin/AdminTestimonialsView.vue'),
    meta: { ...admin, title: 'Testimonios' },
  },
  {
    path: '/admin/socios',
    name: 'AdminPartners',
    component: () => import('@/views/admin/AdminPartnersView.vue'),
    meta: { ...admin, title: 'Socios comerciales' },
  },
  {
    path: '/admin/formularios',
    name: 'AdminLeads',
    component: () => import('@/views/admin/AdminLeadsView.vue'),
    meta: { ...admin, title: 'Formularios recibidos' },
  },
  {
    path: '/admin/ajustes',
    name: 'AdminSettings',
    component: () => import('@/views/admin/AdminSettingsView.vue'),
    meta: { ...admin, title: 'Ajustes del sitio' },
  },
  {
    path: '/admin/cuenta',
    name: 'Account',
    component: () => import('@/views/AccountView.vue'),
    meta: { ...admin, title: 'Mi cuenta' },
  },
]

const routes: Array<RouteRecordRaw> = [
  ...publicRoutes,
  ...adminRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Con "atrás" el navegador devuelve la posición guardada; con un hash se
  // baja a la sección; si no, arriba.
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 90 }
    return { left: 0, top: 0 }
  },
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth || to.meta.guestOnly) {
    // La sesión se verifica contra el API una sola vez por carga.
    await userStore.restore()
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: 'Login', query: { next: to.fullPath }, replace: true }
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return { name: 'Home', replace: true }
  }

  if (to.meta.guestOnly && userStore.isAuthenticated) {
    return { name: 'AdminDashboard', replace: true }
  }
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title && title !== site.name ? `${title} — ${site.name}` : site.name
})

export default router
