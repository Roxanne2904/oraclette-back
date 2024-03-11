const { Event, User } = require("../models");
const functions = require("../utils/functions");
const fs = require("fs");
const { Op, Sequelize } = require("sequelize");

module.exports = {
	async index(req, res) {
		const page = parseInt(req.query.page) || 1;
		const eventPerPage = parseInt(req.query.eventPerPage) || 5;
		const offset = (page - 1) * eventPerPage;

		const { city, gender, lat, lon } = req.query;

		const filters = {
			date: {
				[Op.gte]: new Date(),
			},
			status: {
				[Op.notIn]: ["canceled", "ended"],
			},
		};

		if (city) filters.city = { [Op.substring]: city };

		const genders = ["nonbinary"];

		if (gender) genders.push(gender);

		filters.gender = { [Op.in]: genders };

		const totalEvents = await Event.count({ where: filters });

		let order = [["date", "ASC"]];

		let addDistance = false;
		let distance;
		if (lat && lon) {
			// Valider que lat et lon sont des nombres et dans les plages valides
			const position_lat = parseFloat(lat);
			const position_lon = parseFloat(lon);
			if (
				!isNaN(position_lat) &&
				!isNaN(position_lon) &&
				position_lat >= -90 &&
				position_lat <= 90 &&
				position_lon >= -180 &&
				position_lon <= 180
			) {
				distance = Sequelize.literal(
					// eslint-disable-next-line max-len
					`ROUND(6371 * acos(cos(radians(${position_lat})) * cos(radians(position_lat)) * cos(radians(position_lon) - radians(${position_lon})) + sin(radians(${position_lat})) * sin(radians(position_lat))))`
				);
				order = [[distance, "ASC"]];
				addDistance = true;
			} else {
				return res.status(400).json({ message: "Invalid lat/lon param" });
			}
		}

		const events = await Event.findAll({
			where: filters,
			attributes: {
				include: addDistance ? [[distance, "distance"]] : [],
			},
			order: order,
			limit: eventPerPage,
			offset: offset,
		});

		const formattedEvents = events.map((event) => {
			const currentEvent = event.toJSON();

			currentEvent.image_url =
				process.env.URL_IMAGE_SERVER + currentEvent.image_name;

			delete currentEvent.image_name;

			delete currentEvent.adress;

			return currentEvent;
		});

		return res.status(200).json({
			message: "ok",
			data: {
				totalEvents,
				events: formattedEvents,
			},
		});
	},
	async show(req, res) {
		const { id: eventId } = req.params;

		if (eventId < 1) {
			return res.status(400).json({ message: "Missing or invalid event id" });
		}

		const event = await Event.findOne({
			where: { id: req.params.id },
			include: [
				{
					model: User,
					as: "creator",
					foreignKey: "created_by",
				},
				{
					model: User,
					as: "participants",
					through: { attributes: ["status"] },
				},
			],
		});

		if (!event) {
			return res.status(404).json({ message: "No event found" });
		}

		const eventData = event.toJSON();
		if (event.image_name) {
			eventData.image_url = process.env.URL_IMAGE_SERVER + event.image_name;
		} else {
			eventData.image_url = null;
		}
		delete eventData.image_name;

		const participants = eventData.participants.map((participant) => ({
			id: participant.id,
			firstname: participant.firstname,
			lastname: participant.lastname,
			email: participant.email,
			birthdate: participant.birthdate,
			gender: participant.gender,
			is_admin: participant.is_admin,
			status: participant.EventRegister.status,
		}));

		const acceptedParticipants = participants.filter(
			(participant) => participant.status === "accepted"
		);
		const refusedParticipants = participants.filter(
			(participant) => participant.status === "refused"
		);
		const awaitingParticipants = participants.filter(
			(participant) => participant.status === "awaiting"
		);

		// Hide adresse if user not in party
		let userId = null;
		let token;
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer ")
		) {
			token = req.headers.authorization.split(" ")[1].trim();
		}
		if (token) {
			try {
				userId = await functions.getUserId(token);
				res.userId = userId;
				// eslint-disable-next-line no-empty
			} catch (err) {}
		}
		const userIsInside = acceptedParticipants.some(
			(user) => user.id === userId
		);

		if (!userIsInside) {
			delete eventData.adress;
		}

		return res.status(200).json({
			message: "ok",
			data: {
				...eventData,
				participants: acceptedParticipants,
				refused: refusedParticipants,
				awaiting: awaitingParticipants,
			},
		});
	},
	async store(req, res) {
		const userId = res.userId;

		const event = await Event.create({ ...req.body, created_by: userId });

		res.eventId = event.dataValues.id;

		if (!event) {
			return res.status(500).json({ message: "Event creation failed" });
		}

		let geo_coded = await functions.geoCode(
			event.adress,
			event.zip_code,
			event.city
		);
		event.position_lat = geo_coded.lat;
		event.position_lon = geo_coded.lon;
		event.save();

		return res.status(200).json({
			message: "Event successfully created",
			data: event,
		});
	},
	async update(req, res) {
		const event = await Event.findByPk(req.params.id);

		if (!event) {
			return res.status(204).json({ message: "Event not found" });
		}

		if (functions.isDatePast(event.date)) {
			event.status = "ended";
			return res.status(403).json({ message: "Event already ended" });
		}

		if (req.body.image_name) {
			return res.status(415).json({ message: "Invalide property image_name" });
		}

		if (req.body.base64_picture) {
			// Supprimer l'image si il en exister déjà une.
			if (event.image_name) {
				fs.unlink(`./public_pictures/${event.image_name}`, () => {});
				event.image_name = null;
				event.save();
			}

			await functions
				.storePicture(req.body.base64_picture)
				.then((pictureName) => {
					event.image_name = pictureName;
					event.save();
				})
				.catch((error) => {
					throw new Error(error);
				});
		}

		await event.update(req.body);

		let geo_coded = await functions.geoCode(
			event.adress,
			event.zip_code,
			event.city
		);
		event.position_lat = geo_coded.lat;
		event.position_lon = geo_coded.lon;
		event.save();

		return res.status(200).json({
			message: "Event successfully updated",
			data: event,
		});
	},
	async delete(req, res) {
		const event = await Event.findByPk(req.params.id);

		if (functions.isDatePast(event.date)) {
			event.status = "ended";
		} else {
			event.status = "canceled";
		}

		if (!event) {
			return res.status(204).json({ message: "Event creation failed" });
		}

		try {
			await event.save();
		} catch {
			throw new Error("Event not closed");
		}

		return res.status(200).json({
			message: "Event successfully closed",
			data: event,
		});
	},
};
