import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/problems',
			name: 'problems',
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import('@/views/ProblemsView.vue')
		},
		{
			path: '/problem/:id',
			name: 'problem-detail',
			component: () => import('@/views/ProblemDetailView.vue')
		}
	]
});

export default router;
