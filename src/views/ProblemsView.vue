<template>
	<v-data-table
		:headers="headers"
		:items="items"
		hover
		color="primary"
		@click:row="clickRow"
	></v-data-table>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useProblemStore } from '@/stores/problem';
import camelcaseKeys from 'camelcase-keys';
import { useSettingStore } from '@/stores/setting';

export default {
	name: 'ProblemsView',
	data: () => ({
		headers: [
			{ title: 'id', value: 'id' },
			{ title: 'タイトル', value: 'title' },
			{ title: '説明', value: 'description' }
			// {
			// 	title: '結果',
			// 	align: 'center',
			// 	children: [
			// 		{ title: '1回目', value: '' },
			// 		{ title: '2回目', value: '' },
			// 		{ title: '3回目', value: '' }
			// 	]
			// }
		],
		items: []
	}),
	computed: {
		...mapState(useSettingStore, ['token'])
	},
	async created() {
		await this.getProblems();
	},
	methods: {
		...mapActions(useProblemStore, ['setProblem']),
		async getProblems() {
			try {
				const response = await fetch('/api/problems', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.token}`
					}
				});
				const data = await response.json();
				if (!response.ok)
					throw new Error(
						data.message ? data.message : `getProblems HTTP error! status: ${response.status}`
					);

				this.items = camelcaseKeys(data, { deep: true });
			} catch (error) {
				console.log(error);
			}
		},
		async clickRow(e, row) {
			this.setProblem(row.item);
			this.$router.push(`/problem/${row.item.id}`);
		}
	}
};
</script>

<style scoped></style>
