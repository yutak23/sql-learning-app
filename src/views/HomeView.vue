<template>
	<v-card>
		<v-card-title>SQL実行環境の設定</v-card-title>
		<v-card-subtitle class="text-pre-wrap">
			基本的には、クラウドのTiDBに対してSQLを実行することになりますが、ローカルのNavicatなどを利用したい場合、エンドポイントを以下で設定できます。
		</v-card-subtitle>
		<v-card-text>
			<v-text-field
				label="エンドポイント"
				placeholder="http://192.168.56.5:3000"
				:model-value="endpoint"
				@update:model-value="setToEndpoint"
			/>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<!-- <v-btn color="primary" @click="setToEndpoint">設定</v-btn> -->
		</v-card-actions>
	</v-card>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useSettingStore } from '@/stores/setting';

export default {
	name: 'HomeView',
	data: () => ({}),
	computed: {
		...mapState(useSettingStore, ['endpoint'])
	},
	async created() {
		await this.login();
	},
	methods: {
		...mapActions(useSettingStore, ['setToken', 'setEndpoint']),
		async login() {
			try {
				const response = await fetch('/api/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ email: 'email' })
				});
				const data = await response.json();
				if (!response.ok)
					throw new Error(
						data.message ? data.message : `login HTTP error! status: ${response.status}`
					);

				this.setToken(data.token);
			} catch (error) {
				console.log(error);
			}
		},
		setToEndpoint(e) {
			this.setEndpoint(e);
		}
	}
};
</script>
