import { defineStore } from 'pinia';
import { decodeJwt } from 'jose';

// eslint-disable-next-line import/prefer-default-export
export const useSettingStore = defineStore('setting', {
	state: () => ({
		tokenData: null,
		decodedTokenData: null,
		endpointData: null
	}),
	getters: {
		token: (state) => state.tokenData,
		decodedToken: (state) => state.decodedTokenData,
		endpoint: (state) => state.endpointData
	},
	actions: {
		setToken(token) {
			this.tokenData = token;
			this.decodedTokenData = decodeJwt(token);
		},
		setEndpoint(endpoint) {
			this.endpointData = endpoint;
		}
	},
	persist: true
});
