"use strict";
const { faker } = require("@faker-js/faker/locale/fr");
const { User, Photo } = require("../app/models");

module.exports = {
	async up(queryInterface, Sequelize) {
		const allPhotos = await Photo.findAll({ attributes: ["id"] });
		const allUsers = await User.findAll({ attributes: ["id"] });

		const photoLikes = allPhotos.map((photo) => {
			const randomUser = faker.helpers.arrayElement(allUsers); // Sélectionne un utilisateur aléatoirement pour chaque photo
			return {
				photo_id: photo.id,
				user_id: randomUser.id,
			};
		});

		try {
			await queryInterface.bulkInsert("PhotoLikes", photoLikes, {});
		} catch (error) {
			console.error("Erreur lors de l'insertion des likes de photos :", error);
			throw error;
		}
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("PhotoLikes", null, {});
	},
};
