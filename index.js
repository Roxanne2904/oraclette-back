const http = require("http");
const dotenv = require("dotenv");
const debug = require("debug")("app:server");
const app = require("./app");
const server = http.createServer(app);

if (process.env.NODE_ENV !== "production") {
	dotenv.config();
}

const PORT = process.env.PORT_EXPRESS ?? 8080;
const PORT_OUT = process.env.PORT_OUT ?? 80;
const PORT_PMA = process.env.PORT_PMA ?? 8082;

server.listen(PORT, () => {
	debug(`Listening on ${PORT}`);
});

server.on("listening", () => {
	console.log(`URL : http://localhost:${PORT_OUT}`);
	console.log(`Swagger : http://localhost:${PORT_OUT}/api-docs/`);
	console.log(`phpMyAdmin : http://localhost:${PORT_PMA}`);
});
