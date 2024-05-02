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
		let now = new Date();

		if (date < now) {
			return true;
		}
		return false;
	},

	getUserId(token) {
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

	storePicture(base64Picture) {
		return new Promise((resolve, reject) => {
			const base64Data = base64Picture.split(";base64,").pop();
			const buffer = Buffer.from(base64Data, "base64");

			sharp(buffer)
				.resize(1920, 1080, {
					// Rédimensionne l'image pour limiter l'usage disque
					fit: sharp.fit.inside,
					withoutEnlargement: true,
				})
				// Convertir l'image en PNG sans perte de qualiter
				.toFormat("png", { quality: 100, force: true })
				.removeAlpha() // Supprime la couche alpha
				.toColourspace("srgb") // Convertie l'image en sRGB
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
