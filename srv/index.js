import { Hono } from 'hono';

const app = new Hono();

app.get('/api/hono', (c) => c.json('Hono!'));

export default app;
