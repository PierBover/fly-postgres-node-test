import Fastify from 'fastify';
import pg from 'pg';

const PORT = process.env.PORT || 3000;

let pool;

const fastify = Fastify({
	logger: true
});

fastify.get('/', async function (request, reply) {
	const result = await pool.query('select version();');
	reply.send(result.rows[0].version);
});

async function initDb () {
	const {Pool} = pg;
	pool = new Pool();

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
}

async function start () {
	try {
		await initDb();
		await fastify.listen(PORT, '0.0.0.0');
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
}

start();