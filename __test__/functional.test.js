const dotenv = require("dotenv");
const { faker } = require("@faker-js/faker/locale/fr");

dotenv.config({ path: "/app/.env" });

describe("API Integration Tests", () => {
	let token;

	const email = faker.internet.email();
	const password = faker.internet.password({
		length: 20,
		memorable: true,
		pattern: /[a-zA-Z0-9!@#$%^&*]/,
	});

	test("Create account", async () => {
		const response = await fetch(`${process.env.URL_SERVER_API}auth/signup`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				firstname: faker.person.firstName(),
				lastname: faker.person.lastName(),
				email: email,
				birthdate: "2023-10-10",
				password: password,
				gender: faker.helpers.arrayElement(["female", "male", "nonbinary"]),
			}),
		});
		const data = await response.json();

		// Verifie que l'on à bien reçu un code HTTP 200
		expect(response.status).toBe(200);

		// Verifie que l'on à bien reçu un token
		expect(data.data.access_token).toBeDefined();
		token = data.data.access_token;
	});

	test("Log in", async () => {
		const response = await fetch(`${process.env.URL_SERVER_API}auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: email,
				password: password,
				loginType: "local",
			}),
		});
		const data = await response.json();

		expect(response.status).toBe(200);

		// Verifie que l'on à bien reçu un token
		expect(data.data.access_token).toBeDefined();
	});

	let eventId;
	test("Create event before today", async () => {
		const tomorrow = new Date();
		tomorrow.setDate(new Date().getDate() + 1);
		const formatedTomorrow = tomorrow.toISOString().split("T")[0];
		const response = await fetch(`${process.env.URL_SERVER_API}events`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				description: "Record du monde de Raclette",
				adress: "140 Av. des Champs-Élysées",
				zip_code: "75008",
				city: "Paris",
				available_slot: 2000,
				date: formatedTomorrow,
			}),
		});
		const data = await response.json();

		// Verifie que l'on à bien reçu un code HTTP 200
		expect(response.status).toBe(200);

		// Verifie qu'il y à un id et donc que l'event existe.
		expect(data.data.id).toBeDefined();

		// Verifie qu'il y à un id et donc que l'event existe.
		expect(data.data.id).toBeDefined();

		eventId = data.data.id;
	});
});
