const express = require("express");
const { AuthRouter } = require("./Auth");
const { UserRouter } = require("./User");
const { ZipCodeRouter } = require("./ZipCode");
const { EventRouter } = require("./Event");
const { EventManagementRouter } = require("./EventManagement");
const { MessageRouter } = require("./Message");
const { ContestRouter } = require("./Contest.js");
const router = express.Router();

router.all("/", (req, res) => {
	res.send("Welcome to ORaclette!");
});

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/events", EventRouter);
router.use("/eventManagement", EventManagementRouter);
router.use("/messages", MessageRouter);
router.use("/contest", ContestRouter);
router.use("/zipCode", ZipCodeRouter);

router.use((req) => {
	console.log("Request road : " + req.url + " not found), status 404");
	throw new Error("API Route not found", { statusCode: 404 });
});

module.exports = router;
