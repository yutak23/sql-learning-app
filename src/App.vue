<template>
	<v-responsive class="border rounded">
		<v-app class="bg-grey-lighten-3">
			<v-app-bar color="primary" :elevation="2">
				<template v-slot:prepend>
					<v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
				</template>

				<v-app-bar-title>SQLを学ぼう！</v-app-bar-title>
			</v-app-bar>

			<v-navigation-drawer v-model="drawer" persistent>
				<v-list :lines="false" nav>
					<v-list-item
						v-for="(menu, i) in menus"
						:key="i"
						:value="menu"
						:to="menu.to"
						exact
						color="primary"
					>
						<template v-slot:prepend>
							<v-icon :icon="menu.icon"></v-icon>
						</template>

						<v-list-item-title>{{ menu.title }}</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-navigation-drawer>

			<v-main>
				<v-container>
					<RouterView />
				</v-container>
			</v-main>
		</v-app>
	</v-responsive>
</template>

<script>
export default {
	data: () => ({
		drawer: false,
		menus: [
			{ title: '設定', to: '/', icon: 'mdi-cog-outline' },
			{ title: '問題一覧', to: '/problems', icon: 'mdi-file-document-multiple-outline' }
		]
	})
};
</script>
