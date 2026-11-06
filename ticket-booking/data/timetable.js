// The railway timetable: stations, seat classes and trains.
// This is fixed reference data, not user data, so it lives in code instead of db.json.
// Nothing here is secret: Server and Client Components may both import it.
// Train names are real Bangladesh Railway trains; times, fares and off days are sample data.

export const stations = [
  { code: "DHK", name: "Dhaka", fullName: "Dhaka (Kamalapur)" },
  { code: "APT", name: "Dhaka Airport", fullName: "Dhaka Airport (Biman Bandar)" },
  { code: "CML", name: "Cumilla", fullName: "Cumilla" },
  { code: "CTG", name: "Chattogram", fullName: "Chattogram" },
  { code: "CXB", name: "Cox's Bazar", fullName: "Cox's Bazar (Iconic)" },
  { code: "SRM", name: "Sreemangal", fullName: "Sreemangal" },
  { code: "SYL", name: "Sylhet", fullName: "Sylhet" },
  { code: "TNG", name: "Tangail", fullName: "Tangail" },
  { code: "RJH", name: "Rajshahi", fullName: "Rajshahi" },
  { code: "JSR", name: "Jashore", fullName: "Jashore" },
  { code: "KLN", name: "Khulna", fullName: "Khulna" },
];

// rate = taka per kilometre. seatsPerCoach is always a multiple of 4 (2 + aisle + 2)
export const seatClasses = [
  { code: "S_CHAIR", name: "Shovan Chair", rate: 1.27, seatsPerCoach: 48 },
  { code: "SNIGDHA", name: "Snigdha", rate: 2.43, seatsPerCoach: 40 },
  { code: "AC_S", name: "AC Seat", rate: 2.92, seatsPerCoach: 32 },
];

// Each stop: the station, the time the train is there, and the distance from the first stop.
// nextDay: true = after midnight. Only a train's last stops may be after midnight.
// offDay: the weekday the train doesn't run (0 = Sunday ... 6 = Saturday), null = every day.
// coaches: how many coaches of each class the train pulls.
export const trains = [
  // ----- Dhaka <-> Chattogram -----
  {
    id: "702",
    name: "Subarna Express",
    offDay: 1,
    coaches: { S_CHAIR: 3, SNIGDHA: 2, AC_S: 1 },
    stops: [
      { station: "DHK", time: "16:30", km: 0 },
      { station: "APT", time: "16:55", km: 21 },
      { station: "CTG", time: "21:40", km: 320 },
    ],
  },
  {
    id: "701",
    name: "Subarna Express",
    offDay: 1,
    coaches: { S_CHAIR: 3, SNIGDHA: 2, AC_S: 1 },
    stops: [
      { station: "CTG", time: "07:00", km: 0 },
      { station: "APT", time: "11:45", km: 299 },
      { station: "DHK", time: "12:10", km: 320 },
    ],
  },
  {
    id: "704",
    name: "Mohanagar Provati",
    offDay: null,
    coaches: { S_CHAIR: 3, SNIGDHA: 1, AC_S: 1 },
    stops: [
      { station: "DHK", time: "07:45", km: 0 },
      { station: "APT", time: "08:10", km: 21 },
      { station: "CML", time: "11:05", km: 196 },
      { station: "CTG", time: "14:00", km: 320 },
    ],
  },
  {
    id: "703",
    name: "Mohanagar Godhuli",
    offDay: null,
    coaches: { S_CHAIR: 3, SNIGDHA: 1, AC_S: 1 },
    stops: [
      { station: "CTG", time: "15:00", km: 0 },
      { station: "CML", time: "17:55", km: 124 },
      { station: "APT", time: "21:25", km: 299 },
      { station: "DHK", time: "21:55", km: 320 },
    ],
  },

  // ----- Dhaka <-> Cox's Bazar (overnight) -----
  {
    id: "814",
    name: "Cox's Bazar Express",
    offDay: 3,
    coaches: { S_CHAIR: 2, SNIGDHA: 2, AC_S: 1 },
    stops: [
      { station: "DHK", time: "22:30", km: 0 },
      { station: "APT", time: "22:55", km: 21 },
      { station: "CXB", time: "07:20", km: 551, nextDay: true },
    ],
  },
  {
    id: "813",
    name: "Cox's Bazar Express",
    offDay: 3,
    coaches: { S_CHAIR: 2, SNIGDHA: 2, AC_S: 1 },
    stops: [
      { station: "CXB", time: "12:30", km: 0 },
      { station: "CTG", time: "15:20", km: 231 },
      { station: "APT", time: "20:45", km: 530 },
      { station: "DHK", time: "21:10", km: 551 },
    ],
  },

  // ----- Dhaka <-> Sylhet -----
  {
    id: "709",
    name: "Parabat Express",
    offDay: 2,
    coaches: { S_CHAIR: 3, SNIGDHA: 1, AC_S: 1 },
    stops: [
      { station: "DHK", time: "06:20", km: 0 },
      { station: "APT", time: "06:45", km: 21 },
      { station: "SRM", time: "10:55", km: 254 },
      { station: "SYL", time: "12:55", km: 319 },
    ],
  },
  {
    id: "710",
    name: "Parabat Express",
    offDay: 2,
    coaches: { S_CHAIR: 3, SNIGDHA: 1, AC_S: 1 },
    stops: [
      { station: "SYL", time: "15:45", km: 0 },
      { station: "SRM", time: "17:40", km: 65 },
      { station: "APT", time: "21:55", km: 298 },
      { station: "DHK", time: "22:20", km: 319 },
    ],
  },
  {
    id: "739",
    name: "Upaban Express",
    offDay: null,
    coaches: { S_CHAIR: 2, SNIGDHA: 2, AC_S: 1 },
    stops: [
      { station: "DHK", time: "21:50", km: 0 },
      { station: "APT", time: "22:15", km: 21 },
      { station: "SYL", time: "05:20", km: 319, nextDay: true },
    ],
  },
  {
    id: "740",
    name: "Upaban Express",
    offDay: null,
    coaches: { S_CHAIR: 2, SNIGDHA: 2, AC_S: 1 },
    stops: [
      { station: "SYL", time: "22:00", km: 0 },
      { station: "APT", time: "05:00", km: 298, nextDay: true },
      { station: "DHK", time: "05:30", km: 319, nextDay: true },
    ],
  },

  // ----- Dhaka <-> Rajshahi -----
  {
    id: "753",
    name: "Silk City Express",
    offDay: 0,
    coaches: { S_CHAIR: 3, SNIGDHA: 1, AC_S: 1 },
    stops: [
      { station: "DHK", time: "14:45", km: 0 },
      { station: "APT", time: "15:15", km: 21 },
      { station: "TNG", time: "16:50", km: 98 },
      { station: "RJH", time: "20:40", km: 343 },
    ],
  },
  {
    id: "754",
    name: "Silk City Express",
    offDay: 0,
    coaches: { S_CHAIR: 3, SNIGDHA: 1, AC_S: 1 },
    stops: [
      { station: "RJH", time: "07:40", km: 0 },
      { station: "TNG", time: "11:25", km: 245 },
      { station: "APT", time: "13:05", km: 322 },
      { station: "DHK", time: "13:35", km: 343 },
    ],
  },

  // ----- Dhaka <-> Khulna (over the Padma Bridge) -----
  {
    id: "726",
    name: "Sundarban Express",
    offDay: 3,
    coaches: { S_CHAIR: 3, SNIGDHA: 2, AC_S: 1 },
    stops: [
      { station: "DHK", time: "08:15", km: 0 },
      { station: "JSR", time: "11:50", km: 172 },
      { station: "KLN", time: "12:50", km: 212 },
    ],
  },
  {
    id: "725",
    name: "Sundarban Express",
    offDay: 3,
    coaches: { S_CHAIR: 3, SNIGDHA: 2, AC_S: 1 },
    stops: [
      { station: "KLN", time: "21:45", km: 0 },
      { station: "JSR", time: "22:50", km: 40 },
      { station: "DHK", time: "02:40", km: 212, nextDay: true },
    ],
  },
];
