<template>
	<v-row dense>
		<v-col cols="12">
			<v-card>
				<v-card-text>
					<div class="pb-2">
						<div class="mb-1">問題名</div>
						<div class="text-h6">{{ problem.title }}</div>
					</div>
					<div class="pb-2">
						<div class="mb-1">説明</div>
						<div class="text-body-2 text-pre-wrap">{{ problem.description }}</div>
					</div>
					<div class="pb-2">
						<div class="mb-1">前提となるテーブル</div>
						<div class="px-2" v-for="table in problem.prerequisiteTables" :key="table.tableName">
							<v-data-table
								:headers="prerequisiteTableHeaders(table)"
								:items="prerequisiteTableItems(table)"
								:items-per-page="table.rows.length"
								density="compact"
							>
								<template v-slot:top>
									<v-toolbar density="compact">
										<v-toolbar-title class="text-body-2">
											{{ replaceSuffix(table.tableName) }}テーブル
										</v-toolbar-title>
									</v-toolbar>
								</template>
							</v-data-table>
						</div>
					</div>
					<div>
						<div class="mb-1">期待値</div>
						<div class="px-2">
							<v-data-table
								:headers="expectResultHeaders"
								:items="expectResultItems"
								:items-per-page="problem.expectResult.length"
								density="compact"
							>
							</v-data-table>
						</div>
					</div>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn
						color="primary"
						:loading="isLoading"
						:disabled="isLoading"
						@click="prepareDatabase"
					>
						データベースを準備
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-col>
		<v-col cols="12">
			<v-card>
				<v-card-title>クエリ実行</v-card-title>
				<v-tabs v-model="tab" align-tabs="left" color="primary">
					<v-tab :value="1">ブラウザで実行</v-tab>
					<v-tab :value="2">Navicatで実行</v-tab>
				</v-tabs>

				<v-tabs-window v-model="tab">
					<v-tabs-window-item :value="1">
						<v-card-text>
							<v-alert v-if="queryError" type="error" class="mb-2">{{ queryError }}</v-alert>
							<v-textarea
								v-model="sql"
								label="SQL"
								auto-grow
								bg-color="black"
								hide-details
								class="text-white small-textarea"
							/>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="primary" @click="executeQuery">実行</v-btn>
						</v-card-actions>
					</v-tabs-window-item>
					<v-tabs-window-item :value="2">
						<v-card-text>
							<v-textarea
								v-model="sqlResult"
								label="Navicatで実行した結果"
								auto-grow
								bg-color="black"
								hide-details
								class="text-white small-textarea"
							/>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="primary" @click="parseJsonAndShowDiff">期待値と一致を確認</v-btn>
						</v-card-actions>
					</v-tabs-window-item>
				</v-tabs-window>
			</v-card>
		</v-col>
		<v-col cols="12">
			<v-card>
				<v-card-title>クエリ実行結果</v-card-title>
				<v-card-text>
					<v-alert
						class="mb-2"
						v-if="diffParts.length"
						:type="isDiffExceptResult ? `warning` : `info`"
					>
						<v-alert-title
							>{{ isDiffExceptResult ? `期待値とずれがあります` : `期待値通りです` }}
						</v-alert-title>
						<v-expansion-panels variant="accordion" v-if="isDiffExceptResult">
							<v-expansion-panel>
								<v-expansion-panel-title> ズレ </v-expansion-panel-title>
								<v-expansion-panel-text>
									<div>
										<span class="text-red">赤字</span>
										は期待値にあるが、クエリ結果に存在しないデータです。
									</div>
									<div>
										<span class="text-green">緑字</span>
										はクエリ結果にのみに存在し、期待値にはないデータです。
									</div>
									<div v-html="diffHtml"></div>
								</v-expansion-panel-text>
							</v-expansion-panel>
						</v-expansion-panels>
					</v-alert>
					<v-data-table
						:headers="queryResultHeaders"
						:items="queryResultItems"
						:items-per-page="5"
						density="compact"
					>
						<template v-slot:top>
							<v-toolbar density="compact">
								<v-toolbar-title class="text-body-2"> クエリの実行結果 </v-toolbar-title>
							</v-toolbar>
						</template>
					</v-data-table>
				</v-card-text>
			</v-card>
		</v-col>
		<v-col cols="12">
			<v-card>
				<v-card-title>NG回答例</v-card-title>
				<v-card-text>
					<v-expansion-panels variant="accordion" density="compact">
						<v-expansion-panel>
							<v-expansion-panel-title class="text-body-2"> NG例1 </v-expansion-panel-title>
							<v-expansion-panel-text>
								<div class="text-pre-wrap text-body-2">
									{{ replaceSuffix(problem.wrongSolution1) }}
								</div>
							</v-expansion-panel-text>
						</v-expansion-panel>

						<v-expansion-panel v-if="problem.wrongSolution2">
							<v-expansion-panel-title class="text-body-2"> NG例2 </v-expansion-panel-title>
							<v-expansion-panel-text>
								<div class="text-pre-wrap text-body-2">
									{{ replaceSuffix(problem.wrongSolution2) }}
								</div>
							</v-expansion-panel-text>
						</v-expansion-panel>

						<v-expansion-panel v-if="problem.wrongSolution3">
							<v-expansion-panel-title class="text-body-2"> NG例3 </v-expansion-panel-title>
							<v-expansion-panel-text>
								<div class="text-pre-wrap text-body-2">
									{{ replaceSuffix(problem.wrongSolution3) }}
								</div>
							</v-expansion-panel-text>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-card-text>
			</v-card>
		</v-col>
		<v-col cols="12">
			<v-card>
				<v-card-title>回答例</v-card-title>
				<v-card-text>
					<v-expansion-panels variant="accordion">
						<v-expansion-panel>
							<v-expansion-panel-title class="text-body-2"> 回答 </v-expansion-panel-title>
							<v-expansion-panel-text>
								<div class="text-pre-wrap text-body-2">{{ replaceSuffix(problem.solution) }}</div>
							</v-expansion-panel-text>
						</v-expansion-panel>

						<v-expansion-panel v-if="problem.anotherSolution1">
							<v-expansion-panel-title class="text-body-2"> 別解1 </v-expansion-panel-title>
							<v-expansion-panel-text>
								<div class="text-pre-wrap text-body-2">
									{{ replaceSuffix(problem.anotherSolution1) }}
								</div>
							</v-expansion-panel-text>
						</v-expansion-panel>

						<v-expansion-panel v-if="problem.anotherSolution2">
							<v-expansion-panel-title class="text-body-2"> 別解2 </v-expansion-panel-title>
							<v-expansion-panel-text>
								<div class="text-pre-wrap text-body-2">
									{{ replaceSuffix(problem.anotherSolution2) }}
								</div>
							</v-expansion-panel-text>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						:loading="isLoading"
						:disabled="isLoading"
						@click="registerResult({ isCorrect: false })"
					>
						不正解を記録
					</v-btn>
					<v-btn
						color="primary"
						:loading="isLoading"
						:disabled="isLoading"
						@click="registerResult({ isCorrect: true })"
					>
						正解を記録
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
import { mapState } from 'pinia';
import { useProblemStore } from '@/stores/problem';
import camelCase from 'lodash/camelCase';
import { useSettingStore } from '@/stores/setting';
import { dump } from 'js-yaml';
import { diffLines } from 'diff';
import sortBy from 'lodash/sortBy';
import mapValues from 'lodash/mapValues';
import toPairs from 'lodash/toPairs';
import isString from 'lodash/isString';
import isNaN from 'lodash/isNaN';
import fromPairs from 'lodash/fromPairs';
import snakecaseKeys from 'snakecase-keys';

export default {
	name: 'ProblemDetailView',
	data: () => ({
		isLoading: false,
		tab: 1,
		sql: '',
		sqlResult: '',
		queryError: null,
		queryResultHeaders: [],
		queryResultItems: [],
		diffParts: [],
		diffHtml: ''
	}),
	computed: {
		...mapState(useProblemStore, ['problem']),
		...mapState(useSettingStore, ['token', 'decodedToken', 'endpoint']),
		replaceSuffix() {
			return (text) => text.replaceAll(/%suffix%/g, this.decodedToken.suffix);
		},
		prerequisiteTableHeaders() {
			return (prerequisiteTableData) => {
				return prerequisiteTableData.colOrder.split(',').map((key) => ({
					title: key,
					align: 'center',
					value: camelCase(key)
				}));
			};
		},
		prerequisiteTableItems() {
			return (prerequisiteTableData) => {
				return prerequisiteTableData.rows;
			};
		},
		expectResultHeaders() {
			return this.problem.expectResultColOrder.split(',').map((key) => ({
				title: key,
				align: 'center',
				value: camelCase(key)
			}));
		},
		expectResultItems() {
			return this.problem.expectResult;
		},
		isDiffExceptResult() {
			return this.diffParts.filter((part) => part.added || part.removed).length > 0;
		}
	},
	methods: {
		async prepareDatabase() {
			this.isLoading = true;
			try {
				const url = this.endpoint
					? `${this.endpoint}/api/problem/${this.problem.id}/prepare`
					: `/api/problem/${this.problem.id}/prepare`;
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.token}`
					},
					body: JSON.stringify({ sqls: this.problem.prepareSql })
				});
				const data = await response.json();
				if (!response.ok)
					throw new Error(
						data.message ? data.message : `prepareDatabase HTTP error! status: ${response.status}`
					);
			} catch (error) {
				console.log(error);
			} finally {
				this.isLoading = false;
			}
		},
		async executeQuery() {
			this.isLoading = true;
			this.clearQueryResult();

			try {
				const url = this.endpoint ? `${this.endpoint}/api/execute` : `/api/execute`;
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.token}`
					},
					body: JSON.stringify({ sql: this.sql })
				});
				const data = await response.json();

				if (!response.ok)
					throw new Error(
						data.message ? data.message : `executeQuery HTTP error! status: ${response.status}`
					);

				this.queryResultHeaders = Object.keys(data.result[0]).map((key) => ({
					title: key,
					align: 'center',
					value: key
				}));
				this.queryResultItems = data.result;

				this.diffExpectResult();
			} catch (error) {
				console.log(error);
				this.queryError = error.message;
			} finally {
				this.isLoading = false;
			}
		},
		// eslint-disable-next-line no-unused-vars
		async registerResult({ isCorrect }) {
			this.isLoading = true;
			try {
				const url = this.endpoint
					? `${this.endpoint}/api/problem/${this.problem.id}/result`
					: `/api/problem/${this.problem.id}/result`;
				// 今時点では記録はしない。問題の準備で作成したデータベースのテーブルを削除するのみ。
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.token}`
					},
					body: JSON.stringify({
						delete_tables: this.problem.prerequisiteTables.map((table) =>
							this.replaceSuffix(table.tableName)
						)
					})
				});
				const data = await response.json();
				if (!response.ok)
					throw new Error(
						data.message ? data.message : `registerResult HTTP error! status: ${response.status}`
					);

				this.$router.push(`/problems`);
			} catch (error) {
				console.log(error);
			} finally {
				this.isLoading = false;
			}
		},
		clearQueryResult() {
			this.queryError = null;
			this.queryResultHeaders = [];
			this.queryResultItems = [];
		},
		diffExpectResult() {
			const normalize = (array) => {
				return array
					.map((item) => {
						return mapValues(item, (value) => {
							// 数値に変換可能な文字列は数値に変換
							if (isString(value) && !isNaN(parseFloat(value))) {
								return parseFloat(value);
							}
							return value;
						});
					})
					.map((item) => sortBy(toPairs(item))) // ペアに変換し、キーでソート
					.map((item) => fromPairs(item)) // ペアからオブジェクトに戻す
					.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))); // オブジェクト全体をソート
			};

			const normalizedExpectResult = normalize(
				// this.problemはcamelCase
				snakecaseKeys(this.problem.expectResult, { deep: true })
			);
			const normalizedQueryResultItems = normalize(this.queryResultItems);

			const expectResultYaml = dump(normalizedExpectResult);
			const queryResultYaml = dump(normalizedQueryResultItems);
			this.diffParts = diffLines(expectResultYaml, queryResultYaml);
			this.diffHtml = this.diffParts
				.map((part) => {
					if (part.added)
						return `<div class="text-green" style="white-space:pre-wrap;">${part.value}</div>`;
					if (part.removed)
						return `<div class="text-red" style="white-space:pre-wrap;">${part.value}</div>`;
					return `<div style="color: grey; white-space:pre-wrap;">${part.value}</div>`;
				})
				.join('');
		},
		parseJsonAndShowDiff() {
			const rows = this.sqlResult.trim().split('\n');
			const headers = rows[0].split('\t');
			const jsonArray = rows.slice(1).map((row) => {
				const values = row.split('\t');
				const obj = {};
				headers.forEach((header, index) => {
					obj[header] = values[index];
				});
				return obj;
			});

			this.queryResultHeaders = Object.keys(jsonArray[0]).map((key) => ({
				title: key,
				align: 'center',
				value: key
			}));
			this.queryResultItems = jsonArray;

			this.diffExpectResult();
		}
	}
};
</script>

<style lang="sass">
.small-textarea .v-input__control textarea
    font-size: 12px
th.v-data-table__td.v-data-table-column--align-center.v-data-table__th
    user-select: text
</style>
