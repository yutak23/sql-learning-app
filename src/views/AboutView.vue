<template>
	<div class="about">
		<h1>This is an about page</h1>
		<v-chip color="primary" @click="clickFetch"> Primary! </v-chip>
	</div>
</template>

<script>
export default {
	name: 'AboutView',
	methods: {
		async clickFetch() {
			try {
				const response = await fetch('/api/hono');
				const data = await response.json();
				console.log(data);
			} catch (error) {
				console.log(error);
			}
		}
	}
};
</script>

<style>
@media (min-width: 1024px) {
	.about {
		min-height: 100vh;
		display: flex;
		align-items: center;
	}
}
</style>
