// Achievements, activities and the photo gallery.
// Workshop and event names come from banners and jerseys visible in the photos.

export const milestones = [
  {
    icon: 'award',
    value: '5.00',
    title: 'Perfect GPA, twice',
    text: 'GPA 5.00 out of 5.00 in both the Secondary (SSC) and Higher Secondary (HSC) certificates.',
  },
  {
    icon: 'graduation',
    value: 'B.Sc.',
    title: 'Computer Science & Engineering',
    text: 'Graduated from East West University, Dhaka, with an IoT + machine-learning capstone that ships as a live app.',
  },
  {
    icon: 'shield',
    value: 'YSSE',
    title: 'AI & Cybersecurity internship',
    text: 'IT Intern in the AI Integration & Cybersecurity wing, and the wing\'s weekly presenter.',
  },
  {
    icon: 'users',
    value: '3 clubs',
    title: 'Campus leadership',
    text: 'Two years each volunteering with the Robotics, Science and Telecommunication clubs.',
  },
]

export const activities = [
  { icon: 'presentation', title: 'YSSE IT department training: "Data to Intelligence" and "From Words to Websites"', meta: '2026' },
  { icon: 'presentation', title: 'IoT workshop', meta: 'Workshop' },
  { icon: 'presentation', title: 'CSE 360 field tour to the National Museum of Science and Technology', meta: 'Summer 2024' },
  { icon: 'presentation', title: 'Functional Fitness & Lifestyle for Students', meta: 'Mental and Physical Wellbeing Program' },
  { icon: 'presentation', title: 'Practice of Positive Psychology in Classroom', meta: 'Mental and Physical Wellbeing Program' },
  { icon: 'users', title: 'EWU Science Club new members orientation', meta: '2022' },
  { icon: 'activity', title: 'EWU 5KM Run 2.0 & 3.0, Pantonix Tiger Run Dhaka & Haier Bangladesh Summer Run', meta: 'Runs' },
]

// Add certificates here as { title, issuer, year, href } and a
// "Certifications" block appears automatically.
export const certifications = []

export const galleryCategories = [
  { id: 'academic', label: 'Academic' },
  { id: 'workshops', label: 'Workshops & seminars' },
  { id: 'campus', label: 'Clubs & campus life' },
  { id: 'running', label: 'Running' },
  { id: 'football', label: 'Football' },
]

// w/h are the thumbnail's pixel size (all thumbnails are 560px tall).
export const gallery = [
  {
    id: 'thesis-defense', cat: 'academic', w: 371, h: 560,
    caption: 'Thesis defense day',
    text: 'Holding the bound capstone thesis on the day of the defense.',
    alt: 'Tariful Hoque smiling and holding his bound black thesis book in a hallway under a lit wall clock',
  },
  {
    id: 'cse-department', cat: 'academic', w: 746, h: 560,
    caption: 'Department of Computer Science & Engineering',
    text: 'With classmates at the entrance of the CSE department, East West University.',
    alt: 'Group photo in front of the Department of Computer Science and Engineering entrance at East West University',
  },
  {
    id: 'field-tour-2024', cat: 'academic', w: 746, h: 560,
    caption: 'CSE 360 field tour · Summer 2024',
    text: 'Computer Architecture class visit to the National Museum of Science and Technology.',
    alt: 'Group photo with the banner for the CSE 360 field tour to the National Museum of Science and Technology, Summer 2024',
  },
  {
    id: 'iot-workshop', cat: 'workshops', w: 840, h: 560,
    caption: 'IoT workshop',
    text: 'A full auditorium after a workshop on the Internet of Things.',
    alt: 'Large group photo in an auditorium after an IoT workshop',
  },
  {
    id: 'seminar-session', cat: 'workshops', w: 893, h: 560,
    caption: 'Seminar session',
    text: 'A speaker taking questions from a packed room of students.',
    alt: 'A speaker with a microphone addressing a seated audience during a seminar session',
  },
  {
    id: 'fitness-workshop', cat: 'workshops', w: 599, h: 560,
    caption: 'Functional Fitness & Lifestyle for Students',
    text: 'Workshop from the university\'s Mental and Physical Wellbeing Program.',
    alt: 'Group photo at the Functional Fitness and Lifestyle for Students workshop, part of a Mental and Physical Wellbeing Program',
  },
  {
    id: 'positive-psychology', cat: 'workshops', w: 729, h: 560,
    caption: 'Practice of Positive Psychology in Classroom',
    text: 'Workshop from the Mental and Physical Wellbeing Program for Students.',
    alt: 'Group photo at the Practice of Positive Psychology in Classroom workshop, part of a Mental and Physical Wellbeing Program for Students',
  },
  {
    id: 'orientation-2022', cat: 'campus', w: 840, h: 560,
    caption: 'EWU Science Club orientation · 2022',
    text: 'New Members Orientation & Cultural Program of the EWU Science Club (EWUScC).',
    alt: 'Group photo in a lecture hall at the EWUScC New Members Orientation and Cultural Program 2022',
  },
  {
    id: 'group-monument', cat: 'campus', w: 760, h: 560,
    caption: 'Batch day out',
    text: 'Fellow students together on the steps of a monument.',
    alt: 'Large group photo on the steps in front of a tall white concrete monument',
  },
  {
    id: 'group-lobby', cat: 'campus', w: 747, h: 560,
    caption: 'Celebrating with classmates',
    text: 'Dressed up for a special occasion with friends and classmates.',
    alt: 'Group photo in formal and traditional clothes in a lobby next to two lifts',
  },
  {
    id: 'group-cake', cat: 'campus', w: 995, h: 560,
    caption: 'Cake-cutting celebration',
    text: 'Friends gathered around the table for a celebration.',
    alt: 'Group photo of friends standing around a table with a cake',
  },
  {
    id: 'ewu-5km-run-2', cat: 'running', w: 840, h: 560,
    caption: 'EWU 5KM Run 2.0',
    text: 'Volunteers and runners at the medal table on race day.',
    alt: 'Volunteers and runners in EWU 5KM Run 2.0 jerseys beside a table of medals',
  },
  {
    id: 'ewu-5km-run-3', cat: 'running', w: 995, h: 560,
    caption: 'EWU 5KM Run 3.0',
    text: 'Flying the flag of Bangladesh in the campus courtyard.',
    alt: 'Four people in EWU 5KM Run 3.0 jerseys holding a Bangladesh flag in a university courtyard',
  },
  {
    id: 'marathon-group', cat: 'running', w: 747, h: 560,
    caption: 'Marathon finishers',
    text: 'Medals on, with the running crew in the stadium stands.',
    alt: 'Selfie with a group in red marathon shirts and finisher medals in a stadium seating area',
  },
  {
    id: 'tiger-run-2026', cat: 'running', w: 420, h: 560,
    caption: 'Pantonix Tiger Run Dhaka 2026',
    text: 'Race finished, medals in hand.',
    alt: 'Selfie of three finishers holding Tiger Run Dhaka 2026 medals',
  },
  {
    id: 'summer-run-2026', cat: 'running', w: 373, h: 560,
    caption: 'Haier Bangladesh Summer Run 2026',
    text: 'Arms wide open on the course.',
    alt: 'Runner with arms outstretched during the Haier Bangladesh Summer Run 2026',
  },
  {
    id: 'football-terminal-error', cat: 'football', w: 840, h: 560,
    caption: 'Team Terminal Error',
    text: 'Squad photo in our blue Terminal Error jerseys.',
    alt: 'Football team photo in blue Terminal Error jerseys',
  },
  {
    id: 'football-tournament', cat: 'football', w: 840, h: 560,
    caption: 'Tournament 12.0 · Spark Battalion',
    text: 'Team photo in red Spark Battalion jerseys at Football Tournament 12.0.',
    alt: 'Team photo in red Spark Battalion jerseys in front of a Tournament 12.0 banner',
  },
  {
    id: 'football-match', cat: 'football', w: 840, h: 560,
    caption: 'Matchday squad',
    text: 'Lined up on the turf before kick-off.',
    alt: 'Team photo before a football match on an artificial turf pitch',
  },
  {
    id: 'football-night', cat: 'football', w: 419, h: 560,
    caption: 'Night football',
    text: 'Friends under the floodlights after a night match.',
    alt: 'Group photo on a football pitch at night with a ball in front',
  },
].map((g) => ({
  ...g,
  thumb: `assets/img/gallery/${g.id}-thumb.webp`,
  full: `assets/img/gallery/${g.id}.webp`,
}))
