const http = require("http");
const dotenv = require("dotenv");
const debug = require("debug")("app:server");

if (process.env.NODE_ENV !== "production") {
	dotenv.config();
}

const port = process.env.PORT_EXPRESS ?? 8080;
const port_out = process.env.PORT_OUT ?? 80;
const port_pma = process.env.PORT_PMA ?? 8082;

const app = require("./app");

const server = http.createServer(app);

server.listen(port, () => {
	debug(`Listening on ${port}`);
});

server.on("listening", () => {
	console.log(`URL : http://localhost:${port_out}`);
	console.log(`Swagger : http://localhost:${port_out}/api-docs/`);
	console.log(`phpMyAdmin : http://localhost:${port_pma}`);
});

module.exports = { port };
