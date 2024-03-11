const jwt = require("jsonwebtoken");
const fs = require("fs");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

module.exports = {
	async geoCode(num_and_road, postcode, city) {
		const serviceUrl = "http://geocode.oraclette.com/search";

		const query1 = new URL(serviceUrl);
		query1.searchParams.append("street", num_and_road);
		query1.searchParams.append("city", city);
		query1.searchParams.append("postalcode", postcode);
		query1.searchParams.append("format", "json");

		try {
			const response = await fetch(query1);
			if (!response.ok) {
				throw new Error("Error GeoCodage");
			}

			const result = await response.json();

			if (result.length > 0) {
				return result[0];
			} else {
				const query2 = new URL(serviceUrl);
				query2.searchParams.append("postalcode", postcode);
				query2.searchParams.append("format", "json");
				const response2 = await fetch(query2);

				if (!response2.ok) {
					throw new Error("Error GeoCodage");
				}

				const result2 = await response2.json();

				if (result2.length > 0) {
					return result2[0];
				} else {
					throw new Error("Error GeoCodage");
				}
			}
		} catch (error) {
			throw new Error("Error GeoCodage: " + error.message);
		}
	},

	isDatePast(date) {
		let today = new Date();
		let eventDate;

		if (typeof date === "string") {
			eventDate = new Date(date);
		} else if (date instanceof Date) {
			eventDate = new Date(date.getTime());
		} else {
			throw new Error("Invalid date format");
		}

		eventDate.setHours(23, 59, 59, 999);

		if (eventDate < today) {
			return true;
		}
		return false;
	},

	async getUserId(token) {
		const userId = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).userId;
		return userId;
	},

	paginate(query, { page, pageSize }) {
		const offset = page * pageSize ?? 5;
		const limit = pageSize;

		return {
			...query,
			limit,
			offset,
		};
	},

	async removeBearerFromToken(bearerToken, res) {
		if (!bearerToken) {
			return res
				.status(400)
				.json({ error: "Access token is missing in headers" });
		}

		const accessToken = bearerToken.split("Bearer")[1]?.trim();

		if (!accessToken) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		return accessToken;
	},

	storePicture(base64Picture) {
		return new Promise((resolve, reject) => {
			const base64Data = base64Picture.split(";base64,").pop();
			const buffer = Buffer.from(base64Data, "base64");

			sharp(buffer)
				.resize(1920, 1080, {
					fit: sharp.fit.inside,
					withoutEnlargement: true,
				})
				.toFormat("png", { quality: 100, force: true }) // Convertir en PNG avec une qualité de 100%
				.removeAlpha() // Supprime la couche alpha
				.toColourspace("srgb") // Assurez-vous que l'espace de couleur est sRGB
				.toBuffer()
				.then((processedBuffer) => {
					const uuid = uuidv4();
					fs.writeFile(
						`./public_pictures/${uuid}.png`,
						processedBuffer,
						(err) => {
							if (err) {
								reject("Picture not written on disk");
							} else {
								console.log(`${uuid}.png`);
								resolve(`${uuid}.png`);
							}
						}
					);
				})
				.catch(() => {
					reject("Malformed file");
				});
		});
	},
};
