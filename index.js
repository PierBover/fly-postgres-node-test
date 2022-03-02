import Fastify from 'fastify';
import pg from 'pg';

const PORT = process.env.PORT || 3000;

const fastify = Fastify({
	logger: true
});

fastify.get('/', function (request, reply) {
	reply.send('hello world');
});

async function initDb () {
	const {Pool} = pg;
	const pool = new Pool();

	pool.on('connect', function () {
		console.log('PG CONNECTED');
	});

	pool.on('acquire', function () {
		console.log('PG ACQUIRE');
	});

	pool.on('remove', function () {
		console.log('PG REMOVE');
	});

	pool.on('error', function (error) {
		console.log('PG ERROR');
		console.log(error);
		fastify.log.error(error);
	});

	await pool.connect();

	// Test query
	const result = await pool.query('select version();');
	console.log(result.rows[0]);
}

async function start () {
	try {
		await initDb();
		await fastify.listen(PORT);
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
}

start();