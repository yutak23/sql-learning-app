/* eslint-disable import/no-unresolved */
// eslint-disable-next-line import/no-extraneous-dependencies
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import * as labsComponents from 'vuetify/labs/components';

const vuetify = createVuetify({
	components: { ...components, ...labsComponents },
	directives,
	theme: {
		defaultTheme: 'light'
	},
	icons: {
		defaultSet: 'mdi'
	}
});

export default vuetify;
