'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add a new column for tags as an array
    await queryInterface.addColumn('Articles', 'new_tags', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      defaultValue: [],
    });

    // Copy data from 'tags' to 'new_tags'
    await queryInterface.sequelize.query('UPDATE "Articles" SET "new_tags" = ARRAY["tags"]');

    // Drop the old 'tags' column
    await queryInterface.removeColumn('Articles', 'tags');

    // Rename 'new_tags' to 'tags'
    await queryInterface.renameColumn('Articles', 'new_tags', 'tags');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
