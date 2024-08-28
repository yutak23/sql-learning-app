import { createApp } from 'vue';
import { createPinia } from 'pinia';
// eslint-disable-next-line import/no-extraneous-dependencies
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
// Plugins
import registerPlugins from '@/plugins';

import App from '@/App.vue';
import router from '@/router';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

app.use(router);

registerPlugins(app);

app.mount('#app');
