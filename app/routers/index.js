const express = require("express");

const apiRouter = require("./api");

const router = express.Router();

// Les routes pour l'API
router.use("/api/v1", apiRouter);

router.all("/", (req, res) => {
	res.send("ORaclette API");
});

// Gestion 404
router.use((req, res) => {
	res.status(404).send("Not Found");
});

module.exports = router;
