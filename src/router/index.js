import Vue from 'vue';
import VueRouter from 'vue-router';
import WheelSlide from '../views/WheelSlide.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'wheelSlide',
    component: WheelSlide,
    alias: '/index.html',
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
