const {
	Event,
	User,
	ZipCode,
	Photo,
	PhotoLike,
	EventRegister,
} = require("../models");
const functions = require("../utils/functions");
const jwt = require("jsonwebtoken");

const fs = require("fs");
const { Op, Sequelize } = require("sequelize");

const DEFAULT_GENDER = ["nonbinary", "female", "male"];

const handleGenderRequest = (gender = null) => {
	if (gender) return [gender];
	return DEFAULT_GENDER;
};

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

		//! A garder au cas où
		// const genders = ["nonbinary"];
		// if (gender) genders.push(gender);
		//!

		filters.gender = { [Op.in]: handleGenderRequest(gender) };

		const totalEvents = await Event.count({ where: filters });

		let order = [["date", "ASC"]];

		let addDistance = false;
		let distance;
		if (lat && lon) {
			// Valider que lat et lon sont des nombres et dans les plages valides
			const latitude = parseFloat(lat);
			const longitude = parseFloat(lon);
			if (
				!isNaN(latitude) &&
				!isNaN(longitude) &&
				latitude >= -90 &&
				latitude <= 90 &&
				longitude >= -180 &&
				longitude <= 180
			) {
				distance = Sequelize.literal(
					// eslint-disable-next-line max-len
					`ROUND(6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude))))`
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

		const formattedEvents = await Promise.all(
			events.map(async (event) => {
				const currentEvent = event.toJSON();

				const image = await Photo.findOne({
					where: { event_id: currentEvent.id },
				});

				if (image) {
					currentEvent.image_url =
						process.env.URL_IMAGE_SERVER + image.file_name;
				}

				delete currentEvent.address; // Assurez-vous également que c'est bien 'address' et non 'adress'

				return currentEvent;
			})
		);

		return res.status(200).json({
			message: "ok",
			data: {
				totalEvents,
				events: formattedEvents,
			},
		});
	},
	async dislike(req, res) {
		const event = await Event.findByPk(req.params.id);
		if (event === null) {
			return res.status(404).json({ error: "Event not found" });
		}

		const photo = await Photo.findOne({ where: { event_id: event.id } });
		if (photo === null) {
			return res.status(404).json({ error: "Photo not found" });
		}

		const like = await PhotoLike.findOne({
			where: { photo_id: photo.id, user_id: res.currentUser.id },
		});

		if (like === null) {
			return res.status(409).json({ error: "Not liked" });
		}

		await like.destroy();

		return res.status(200).json({ message: "OK" });
	},
	async like(req, res) {
		const event = await Event.findByPk(req.params.id);
		if (event === null) {
			return res.status(404).json({ error: "Event not found" });
		}

		const photo = await Photo.findOne({
			where: { event_id: event.id },
		});

		if (photo === null) {
			return res.status(404).json({ error: "Photo not found" });
		}

		const like = await PhotoLike.findOne({
			where: { photo_id: photo.id, user_id: res.currentUser.id },
		});

		if (like != null) {
			return res.status(409).json({ error: "Already like" });
		}

		const photoLike = await PhotoLike.create({
			photo_id: photo.id,
			user_id: res.currentUser.id,
		});

		if (!photoLike) {
			return res.status(404).json({
				error: "PhotoLike registration failed",
			});
		}

		return res.status(202).json({ message: "OK" });
	},
	async show(req, res) {
		const { id: eventId } = req.params;
		const userFromToken = res.currentUser.dataValues.id;

		if (eventId < 1) {
			return res.status(400).json({ message: "Missing or invalid event id" });
		}

		const event = await Event.findOne({
			where: { id: req.params.id },
			include: [
				{
					model: User,
					as: "creator",
					foreignKey: "user_id",
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
		const image = await Photo.findOne({
			where: { event_id: eventData.id },
		});

		if (image) {
			eventData.image_url = process.env.URL_IMAGE_SERVER + image.file_name;
		} else {
			eventData.image_url = null;
		}

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
		const banParticipants = participants.filter(
			(participant) => participant.status === "banned"
		);

		// Hide adresse if user not in party
		//? TO CHECK - Répétition non ? On récupère le currentUserId depuis
		//? le middleware "verifyToken"

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
			} catch (err) {
				throw err;
			}
		}
		const userIsInside = acceptedParticipants.some(
			(user) => user.id === userId
		);

		if (!userIsInside) {
			delete eventData.adress;
		}

		const currentUserFromParticipants = participants.find((user) => {
			return user.id === userFromToken;
		});
		const currentParticipantStatus = currentUserFromParticipants
			? currentUserFromParticipants.status
			: [];

		return res.status(200).json({
			message: "ok",
			data: {
				...eventData,
				participants: acceptedParticipants,
				refused: refusedParticipants,
				awaiting: awaitingParticipants,
				banned: banParticipants,
				current_participant_status: currentParticipantStatus,
			},
		});
	},
	async store(req, res) {
		const event = await Event.create({
			...req.body,
			user_id: res.currentUser.id,
		});

		res.eventId = event.dataValues.id;

		if (!event) {
			return res.status(500).json({ message: "Event creation failed" });
		}

		let geo_coded = await functions.geoCode(
			event.adress,
			event.zip_code,
			event.city
		);
		event.latitude = geo_coded.lat;
		event.longitude = geo_coded.lon;
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
			const existingPhoto = await Photo.findOne({
				where: { event_id: event.id },
			});

			// Supprimer l'image si il en exister déjà une.
			if (existingPhoto) {
				fs.unlink(`./public_pictures/${event.image_name}`, () => {});
				event.image_name = null;
				event.save();
			}

			await functions
				.storePicture(req.body.base64_picture)
				.then(async (pictureName) => {
					if (existingPhoto) {
						await existingPhoto.update({ file_name: pictureName });
					} else {
						await Photo.create({
							file_name: pictureName,
							event_id: event.id,
						});
					}
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
		event.latitude = geo_coded.lat;
		event.longitude = geo_coded.lon;
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
