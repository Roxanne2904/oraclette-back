const functions = require("../app/utils/functions");

describe("isDatePast", () => {
	it("Test objects Date - yesterday", () => {
		let yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		expect(functions.isDatePast(yesterday)).toBe(true);
	});

	it("Test objects Date - now", () => {
		const now = new Date();
		expect(functions.isDatePast(now)).toBe(false);
	});

	it("Test objects Date - tomorrow", () => {
		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		// let dateISO = tomorrow.toISOString();
		expect(functions.isDatePast(tomorrow)).toBe(false);
	});

	it("Test bad string", () => {
		expect(functions.isDatePast("raceltte")).toBe(false);
	});
});
