const express = require("express");
const apiRouter = require("./api");
const router = express.Router();

// Les routes pour l'API
router.use("/api/v1", apiRouter);

router.all("/", (_, res) => {
	res.send(`Welcome to - O'Raclette API -`);
});

// Gestion 404
router.use((req, res) => {
	res.status(404).send("Not Found");
});

module.exports = router;
