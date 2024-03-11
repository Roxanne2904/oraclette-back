const { Op, Sequelize } = require("sequelize");
const jwt = require("jsonwebtoken");
const { Event, EventLike, User } = require("../models");
const functions = require("../utils/functions");

module.exports = {
	async contest(req, res) {
		const { authorization: bearer } = req.headers;

		let userId = null;

		if (bearer) {
			const token = await functions.removeBearerFromToken(bearer, res);

			jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

			userId = await functions.getUserId(token);
		}

		const currentDate = new Date();

		const currentMonthStart = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() - 1,
			1
		);
		const currentMonthEnd = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			0
		);

		const lastMonthStart = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() - 2,
			1
		);
		const lastMonthEnd = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			0
		);

		const popularityRatioCalcQuery =
			"(Event.available_slot / (SELECT COUNT(*) FROM EventRegisters WHERE EventRegisters.event_id = Event.id))";

		const monthEventsAttributes = [
			"id",
			"image_name",
			"city",
			"date",
			"available_slot",
			[Sequelize.literal(popularityRatioCalcQuery), "popularity_ratio"],
		];

		if (userId) {
			monthEventsAttributes.push([
				Sequelize.literal(
					`(EXISTS(SELECT 1 FROM EventLikes WHERE EventLikes.event_id = Event.id AND EventLikes.liked_by = ${userId}))`
				),
				"is_liked_by_user",
			]);
		}

		const currentMonthEvents = await Event.findAll({
			attributes: monthEventsAttributes,
			where: {
				date: {
					[Op.between]: [currentMonthStart, currentMonthEnd],
				},
			},
			include: [
				{
					model: User,
					as: "participants",
					attributes: [],
					through: { attributes: [] },
				},
			],
			order: [[Sequelize.literal(popularityRatioCalcQuery), "ASC"]],
			group: ["Event.id"],
			limit: 12,
		});

		const lastMonthMostLikedEvent = await EventLike.findOne({
			attributes: [
				"event_id",
				[Sequelize.fn("COUNT", Sequelize.col("liked_by")), "like_count"],
			],
			include: [
				{
					model: Event,
					where: {
						date: {
							[Op.between]: [lastMonthStart, lastMonthEnd],
						},
					},
				},
			],
			group: ["event_id"],
			order: [[Sequelize.literal("like_count"), "DESC"]],
		});

		const lastMonthEventWinner = await Event.findOne({
			attributes: ["id", "image_name", "date"],
			where: {
				id: lastMonthMostLikedEvent.event_id,
			},
			include: [
				{
					model: User,
					as: "creator",
					attributes: ["firstname"],
				},
			],
		});

		return res.status(200).json({
			message: "ok",
			data: {
				lastMonthEventWinner,
				currentMonthEvents,
			},
		});
	},
	async like(req, res) {
		const { eventId } = req.body;

		if (!eventId) {
			return res.status(400).json({ message: "Missing or invalid event id" });
		}

		const event = await Event.findByPk(eventId);

		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		const eventLiked = await EventLike.findOne({
			where: {
				event_id: eventId,
				liked_by: res.userId,
			},
		});

		let statusMessage = "Event successfully liked";

		if (eventLiked) {
			await eventLiked.destroy();

			statusMessage = "Event successfully unliked";
		} else {
			await EventLike.create({
				event_id: eventId,
				liked_by: res.userId,
			});
		}

		return res.status(200).json({ message: statusMessage });
	},
};
