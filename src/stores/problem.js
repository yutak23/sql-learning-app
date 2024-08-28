import { defineStore } from 'pinia';

// eslint-disable-next-line import/prefer-default-export
export const useProblemStore = defineStore('problem', {
	state: () => ({
		problemData: {}
	}),
	getters: {
		problem: (state) => state.problemData
	},
	actions: {
		setProblem(data) {
			this.problemData = data;
		}
	},
	persist: true
});
