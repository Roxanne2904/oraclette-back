"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`
    CREATE TRIGGER AfterEventsDelete
    AFTER DELETE ON Events
    FOR EACH ROW
    BEGIN
    	INSERT INTO Logs (\`action\`, \`table\`, element_id, user_id)
        VALUES ('de', 'tab', OLD.id, OLD.user_id);
    END
  `);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS AfterEventsDelete;
    `);
	},
};
