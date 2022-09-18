const express = require('express');
const next = require('next');
const hostname = 'localhost';
const dev = process.env.NODE_ENV !== 'production';
const port = dev ? 3000 : Number(process.env.PORT) || 80;
const { parse } = require('url');

const app = next({
	dev,
	hostname,
	port,
});

const listRoutes = ['/'];

const handle = app.getRequestHandler();

app
	.prepare()
	.then(() => {
		const server = express();

		listRoutes.map((item) => {
			return server.get(item, (req, res) => {
				const parsedUrl = parse(req.url, true);
				const { query } = parsedUrl;
				if (item === '/') {
					if (req.url === '/?bot_crawler=true') app.render(req, res, '/home-ssr', query);
					else app.render(req, res, '/', query);
				}

				return handle(req, res);
			});
		});

		server.all('*', (req, res) => {
			return handle(req, res);
		});

		server.listen(port, (err) => {
			if (err) throw err;

			console.log(`> Ready on port ${port}`);
		});
	})
	.catch((err) => {
		console.log('An error occurred, unable to start the server', err);
	});
