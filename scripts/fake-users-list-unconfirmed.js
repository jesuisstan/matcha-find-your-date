// Export a function that accepts hashedPassword and yesterday as parameters
module.exports = function (hashedPassword, yesterday) {
  return [
    {
      email: 'john.doe1@example.com',
      password: hashedPassword,
      firstname: 'John',
      lastname: 'Doe',
      nickname: 'Johnny1',
      birthdate: '1990-05-10',
      sex: 'male',
      sex_preferences: 'bisexual', // Default for unconfirmed
      registration_date: yesterday.toISOString(),
      confirmed: false,
      online: false,
      popularity: 0,
      biography: null,
      tags: null,
      latitude: null,
      longitude: null,
      address: null,
      photos: null,
      last_action: null,
      complete: false,
      service_token: null,
    },
    {
      email: 'james.bond2@example.com',
      password: hashedPassword,
      firstname: 'James',
      lastname: 'Bond',
      nickname: 'Agent007',
      birthdate: '1985-12-04',
      sex: 'male',
      sex_preferences: 'bisexual', // Default for unconfirmed
      registration_date: yesterday.toISOString(),
      confirmed: false,
      online: false,
      popularity: 0,
      biography: null,
      tags: null,
      latitude: null,
      longitude: null,
      address: null,
      photos: null,
      last_action: null,
      complete: false,
      service_token: null,
    },
    // More unconfirmed users...
  ];
};
