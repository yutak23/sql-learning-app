import { Hono } from 'hono';
// eslint-disable-next-line import/no-unresolved
import { cors } from 'hono/cors';
import { connect } from '@tidbcloud/serverless';
import { DateTime } from 'luxon';
import JWT from './lib/jwt';
import HttpError from './lib/http-error';

const app = new Hono();
const db = connect({
	username: import.meta.env.VITE_DB_USERNAME,
	password: import.meta.env.VITE_DB_PASSWORD,
	host: import.meta.env.VITE_DB_HOST,
	database: 'sql_learning_app'
});
const dbSandbox = connect({
	username: import.meta.env.VITE_DB_SANDBOX_USERNAME,
	password: import.meta.env.VITE_DB_SANDBOX_PASSWORD,
	host: import.meta.env.VITE_DB_SANDBOX_HOST,
	database: 'sandbox'
});

if (import.meta.env.DEV) {
	// For using SMH,
	// 	it is necessary to allow self-signed server certificates during HTTPS communication.
	// https://github.com/orgs/nodejs/discussions/44038
	// eslint-disable-next-line import/no-extraneous-dependencies
	const { Agent, setGlobalDispatcher } = await import('undici');
	const agent = new Agent({
		connect: {
			rejectUnauthorized: false
		}
	});
	setGlobalDispatcher(agent);
}

// ローカルに向けてリクエストできるようにする
app.use('/api/problem/:id/prepare', cors());
app.use('/api/execute', cors());
app.use('/api/problem/:id/result', cors());

app.post('/api/login', async (c) => {
	try {
		const { email } = await c.req.json();
		const jwt = new JWT(import.meta.env.VITE_JWT_SECRET);
		const token = await jwt.sign({ email, suffix: `_${DateTime.local().toUnixInteger()}` });
		return c.json({ token }, 200);
	} catch (e) {
		return c.json({ message: e.message }, 500);
	}
});

app.use(async (c, next) => {
	try {
		const { authorization } = c.req.header();
		if (!authorization) throw new HttpError(401, 'Unauthorized1');

		const [type, token] = authorization.split(/\s/, 2);
		if (type !== 'Bearer') throw new HttpError(401, 'Unauthorized2');
		if (!token) throw new HttpError(401, 'Unauthorized3');

		const jwt = new JWT(import.meta.env.VITE_JWT_SECRET);
		const { payload } = await jwt.verify(token);
		// eslint-disable-next-line no-param-reassign
		c.req.jwtPayload = payload;
		return next();
	} catch (e) {
		return c.json({ message: e.message }, e.status ? e.status : 500);
	}
});

app.get('/api/problems', async (c) => {
	const result = await db.execute('SELECT * FROM problems');
	return c.json(result);
});

app.post('/api/problem/:id/prepare', async (c) => {
	try {
		const { sqls } = await c.req.json();
		for (let i = 0; i < sqls.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			await dbSandbox.execute(sqls[i].query.replace(/%suffix%/, c.req.jwtPayload.suffix));
		}
		return c.json({ message: 'OK' }, 201);
	} catch (e) {
		return c.json({ message: e.message }, 500);
	}
});

app.post('/api/execute', async (c) => {
	try {
		const { sql } = await c.req.json();
		const result = await dbSandbox.execute(sql);
		return c.json({ result }, 200);
	} catch (e) {
		return c.json({ message: e.message }, 500);
	}
});

app.post('/api/problem/:id/result', async (c) => {
	try {
		const { delete_tables: deleteTables } = await c.req.json();
		for (let i = 0; i < deleteTables.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			await dbSandbox.execute(`DROP TABLE ${deleteTables[i]}`);
		}
		return c.json({ message: 'OK' }, 200);
	} catch (e) {
		return c.json({ message: e.message }, 500);
	}
});

export default app;
