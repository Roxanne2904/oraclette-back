const { Op, Sequelize } = require("sequelize");
const jwt = require("jsonwebtoken");
const { Event, PhotoLike, Photo, User } = require("../models");
const functions = require("../utils/functions");

const formatEventPhotoData = (element) => {
	const likes = element.likes.reduce((acc, val) => acc.concat(val.user_id), []);

	return {
		file_name: element.file_name,
		id: element.id,
		liked_by: likes,
	};
};

const handleDates = () => {
	const currentDate = new Date();
	return {
		// Dernier jour du mois courrant
		endOfLastMonth: new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			0 // 0 indique le dernier jour du mois
		),

		// Premier jour du mois en cours - 2
		lastMonthStart: new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() - 2,
			1
		),
		// Dernier jours du mois précédent
		lastMonthEnd: new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() - 1,
			0
		),
	};
};

module.exports = {
	async contestWinner(_, res) {
		const { lastMonthStart, lastMonthEnd } = handleDates();

		let lastMonthEventWinner = await Event.findOne({
			attributes: {
				include: [
					[
						Sequelize.fn("COUNT", Sequelize.col("photo->likes.photo_id")),
						"totalLikes",
					],
				],
			},
			include: [
				{
					model: Photo,
					as: "photo",
					attributes: ["file_name"],
					required: true, // Assurez-vous que seuls les événements ayant une photo sont inclus
					include: [
						{
							model: PhotoLike,
							as: "likes",
							attributes: [],
						},
					],
				},
				{
					model: User,
					as: "creator",
				},
			],
			group: ["Event.id", "photo.id", "photo->likes.photo_id", "creator.id"],
			order: [[Sequelize.literal("totalLikes"), "DESC"]],
			where: {
				date: {
					[Sequelize.Op.gte]: lastMonthStart,
					[Sequelize.Op.lt]: lastMonthEnd,
				},
			},
			limit: 1,
			subQuery: false,
		});

		lastMonthEventWinner = lastMonthEventWinner.toJSON();

		lastMonthEventWinner.image_url =
			process.env.URL_IMAGE_SERVER + lastMonthEventWinner.photo.file_name;
		delete lastMonthEventWinner.photo;

		return res.status(200).json({
			message: "ok",
			data: {
				lastMonthEventWinner,
			},
		});
	},
	async contest(_, res) {
		const { lastMonthEnd, endOfLastMonth } = handleDates();

		const events = await Event.findAll({
			include: [
				{
					model: Photo,
					as: "photo",
					attributes: ["file_name", "id"],
					required: true,
					include: [
						{
							model: PhotoLike,
							as: "likes",
							required: false,
							where: {
								user_id: res.currentUser.id,
							},
							attributes: {
								exclude: ["createdAt", "updatedAt", "photo_id"],
							},
						},
					],
				},
			],
			limit: 12,
			order: Sequelize.literal("RAND()"),
			where: {
				date: {
					[Sequelize.Op.gte]: lastMonthEnd,
					[Sequelize.Op.lt]: endOfLastMonth,
				},
			},
		});

		const currentMonthEvents = await Promise.all(
			events.map(async (event) => {
				const eventJson = event.toJSON();

				const getPhoto = await event.getPhoto();

				if (getPhoto) {
					const imageUrl = process.env.URL_IMAGE_SERVER + getPhoto.file_name;
					const getLiked = await getPhoto.getIsLikedBy(res.currentUser);

					return {
						...eventJson,
						image_url: imageUrl,
						is_liked_by_user: getLiked ? true : false,
						photo: formatEventPhotoData(eventJson.photo),
					};
				}

				return eventJson;
			})
		);

		return res.status(200).json({
			message: "ok",
			data: {
				currentMonthEvents,
			},
		});
	},
	async unlike(req, res) {
		await like(req, res);
	},
	async like(req, res) {
		console.log("****************************");
		console.log(res.currentUser);
		console.log(res.currentUser);
		console.log(res.currentUser);
		console.log(res.currentUser);
		console.log("****************************");
		const { eventId } = req.body;

		const event = await Event.findByPk(eventId);

		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		const photoLiked = await PhotoLike.findOne({
			where: {
				event_id: eventId,
				user_id: res.currentUser.id,
			},
		});

		let statusMessage = "Event successfully liked";

		if (photoLiked) {
			await photoLiked.destroy();

			statusMessage = "Event successfully unliked";
		} else {
			await PhotoLike.create({
				event_id: eventId,
				user_id: res.currentUser.id,
			});
		}

		return res.status(200).json({ message: statusMessage });
	},
};
