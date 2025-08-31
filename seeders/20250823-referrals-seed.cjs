module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    return queryInterface.bulkInsert('referrals', [
      {
        username: 'ref_test1',
        fullname: 'Referral Test One',
        email: 'ref1@example.com',
        phone_number: '+1234567890',
        register_date: 'Monday',
        created_at: now,
        update_at: now
      },
      {
        username: 'ref_test2',
        fullname: 'Referral Test Two',
        email: 'ref2@example.com',
        phone_number: '+1987654321',
        register_date: 'Tuesday',
        created_at: now,
        update_at: now
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('referrals', {
      email: { [Sequelize.Op.in]: ['ref1@example.com', 'ref2@example.com'] }
    });
  }
};
