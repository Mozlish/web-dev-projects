// All the movies in our store.
// In a real app this would come from a database or an API —
// for practice, a plain array is perfect.

export const categories = [
  { id: "all", label: "All Movies" },
  { id: "trending", label: "Trending" },
  { id: "new-releases", label: "New Releases" },
  { id: "coming-soon", label: "Coming Soon" },
];

export const movies = [
  {
    id: 1,
    title: "Neon Horizon",
    cover: "/posters/neon-horizon.svg",
    genre: "Sci-Fi / Action",
    year: 2026,
    duration: "2h 08m",
    rating: 5,
    price: 120,
    categories: ["trending", "new-releases"],
    description:
      "In a city that never powers down, a getaway driver discovers the traffic grid is alive — and it has chosen her to lead a revolution of machines against the people who built them.",
  },
  {
    id: 2,
    title: "The Last Lighthouse",
    cover: "/posters/the-last-lighthouse.svg",
    genre: "Drama / Mystery",
    year: 2025,
    duration: "1h 54m",
    rating: 4,
    price: 90,
    categories: ["trending"],
    description:
      "A retired keeper returns to the island lighthouse he abandoned thirty years ago, only to find the lamp still burning and a logbook written in his own handwriting.",
  },
  {
    id: 3,
    title: "Desert Bloom",
    cover: "/posters/desert-bloom.svg",
    genre: "Romance / Adventure",
    year: 2026,
    duration: "1h 47m",
    rating: 4,
    price: 80,
    categories: ["new-releases"],
    description:
      "Two rival botanists race across the dunes to find a flower that only opens once a century. Somewhere between sandstorms and stolen maps, the competition turns into something else.",
  },
  {
    id: 4,
    title: "Orbit Nine",
    cover: "/posters/orbit-nine.svg",
    genre: "Sci-Fi / Thriller",
    year: 2026,
    duration: "2h 21m",
    rating: 5,
    price: 150,
    categories: ["trending", "coming-soon"],
    description:
      "The crew of a cargo ship wakes from cryosleep orbiting a planet that isn't on any map. Their ship's computer insists they have been there for nine hundred years.",
  },
  {
    id: 5,
    title: "Whispering Pines",
    cover: "/posters/whispering-pines.svg",
    genre: "Horror",
    year: 2025,
    duration: "1h 39m",
    rating: 3,
    price: 70,
    categories: ["trending"],
    description:
      "A family rents a cabin deep in the forest for a quiet weekend. On the first night the trees start repeating their conversations back to them — word for word.",
  },
  {
    id: 6,
    title: "Concrete Kings",
    cover: "/posters/concrete-kings.svg",
    genre: "Crime / Action",
    year: 2026,
    duration: "2h 12m",
    rating: 4,
    price: 110,
    categories: ["new-releases", "coming-soon"],
    description:
      "Three brothers who built half the skyline are pulled into a turf war when their newest tower turns out to be sitting on the city's biggest secret.",
  },
  {
    id: 7,
    title: "Paper Moons",
    cover: "/posters/paper-moons.svg",
    genre: "Animation / Family",
    year: 2025,
    duration: "1h 32m",
    rating: 5,
    price: 60,
    categories: ["trending", "new-releases"],
    description:
      "A shy girl folds a paper boat that carries her into a sky-sea where the moon is made of origami — and it is slowly coming unfolded.",
  },
  {
    id: 8,
    title: "Tidebreaker",
    cover: "/posters/tidebreaker.svg",
    genre: "Action / Adventure",
    year: 2026,
    duration: "2h 03m",
    rating: 3,
    price: 100,
    categories: ["coming-soon"],
    description:
      "A disgraced surf champion takes one last job: guiding a research team into the heart of a wave that hasn't stopped breaking for forty days.",
  },
  {
    id: 9,
    title: "Glass Garden",
    cover: "/posters/glass-garden.svg",
    genre: "Fantasy / Drama",
    year: 2026,
    duration: "1h 58m",
    rating: 4,
    price: 95,
    categories: ["coming-soon", "new-releases"],
    description:
      "After inheriting her grandmother's greenhouse, a young gardener learns every plant inside was grown from a memory — and someone wants them back.",
  },
];
