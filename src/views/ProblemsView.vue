<template>
	<v-data-table
		:headers="headers"
		:items="items"
		hover
		color="primary"
		:loading="isloading"
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
		isloading: false,
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
		this.isloading = true;
		await this.getProblems();
		this.isloading = false;
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
			this.setProblem({
				...row.item,
				prerequisiteTables: camelcaseKeys(this.parseSQLToJSON(row.item.prepareSql), { deep: true })
			});
			this.$router.push(`/problem/${row.item.id}`);
		},
		parseSQLToJSON(sqlArray) {
			// INSERT INTO部分のクエリを取得
			const insertQuery = sqlArray.find((entry) => entry.query.startsWith('INSERT INTO')).query;

			// テーブル名を取得
			const tableNameMatch = insertQuery.match(/INSERT INTO (\S+)\s*\(/);
			const tableName = tableNameMatch ? tableNameMatch[1] : '';

			// カラム名を取得
			const columnsMatch = insertQuery.match(/\(([^)]+)\) VALUES/);
			const columns = columnsMatch
				? columnsMatch[1].split(',').map((col) => col.trim().replace(/`/g, ''))
				: [];

			// VALUES部分を抽出
			const valuesMatch = insertQuery.match(/VALUES\s*\((.+)\);/);
			const valuesString = valuesMatch ? valuesMatch[1].split('), (') : [];

			// データをパースしてJSON化
			const rows = valuesString.map((rowStr) => {
				const rowValues = rowStr.split(',').map((value) => value.trim().replace(/'/g, ''));
				const rowObj = {};
				columns.forEach((col, idx) => {
					// NULLを空文字に変換
					rowObj[col] = rowValues[idx] === 'NULL' ? '' : rowValues[idx];
				});
				return rowObj;
			});

			// 最終的なJSON形式に整形
			return [
				{
					rows,
					colOrder: columns.join(','),
					tableName
				}
			];
		}
	}
};
</script>

<style scoped></style>
