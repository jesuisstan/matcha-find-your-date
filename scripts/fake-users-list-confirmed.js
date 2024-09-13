// Export a function that accepts hashedPassword and yesterday as parameters
module.exports = function (hashedPassword, yesterday) {
  return [
    {
      email: 'alex.smith@example.com',
      password: hashedPassword,
      confirmed: true,
      firstname: 'Alex',
      lastname: 'Smith',
      nickname: 'AlexS',
      birthdate: '1987-03-21',
      sex: 'male',
      biography: 'Adventurous person who loves outdoor activities and exploring new places.',
      tags: ['adventurous', 'globetrotter', 'fitness'],
      latitude: 48.8566, // Paris
      longitude: 2.3522,
      address: 'Paris, France',
      sex_preferences: 'women',
      photos: ['https://kdbxq6eseiqtwhzx.public.blob.vercel-storage.com/m0-0.jpg'],
      complete: true,
      popularity: 0,
      registration_date: yesterday.toISOString(),
      last_action: new Date().toISOString(),
      online: true,
      service_token: null,
    },
    {
      email: 'peter.parker@example.com',
      password: hashedPassword,
      firstname: 'Peter',
      lastname: 'Parker',
      nickname: 'Spidey',
      birthdate: '1992-08-10',
      sex: 'male',
      biography:
        'Photographer by day, superhero by night. Looking for someone to share my adventures.',
      tags: ['photography', 'adventurous', 'fitness'],
      latitude: 51.5074, // London
      longitude: -0.1278,
      address: 'London, United Kingdom',
      sex_preferences: 'men',
      photos: ['https://kdbxq6eseiqtwhzx.public.blob.vercel-storage.com/m1-0.jpg'],
      complete: true,
      popularity: 0,
      registration_date: yesterday.toISOString(),
      last_action: new Date().toISOString(),
      online: false,
      confirmed: true,
      service_token: null,
    },
    // More confirmed users...
  ];
};
