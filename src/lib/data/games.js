import { dev } from "$app/environment";

export const games = [
  {
    title: "Woord",
    slug: "/play/woord",
    thumbnail: "/games/woord.jpg",
    disabled: !dev,
    description: "Guess the woord of the day in six tries.",
  },

  {
    title: "Connections",
    slug: "/play/connection",
    thumbnail: "/games/connection.webp",
    disabled: !dev,
    description: "Groups words that share a common thread.",
  },

  {
    title: "Mathic",
    slug: "/play/mathic",
    thumbnail: "/games/mathic.jpg",
    disabled: !dev,
    description: "Test your speed and accuracy by forming equations.",
  },

  {
    title: "Tally",
    slug: "/play/tally",
    thumbnail: "/games/tally.jpg",
    disabled: !dev,
    description: "Solve number additions within every 5 minutes.",
  },
];
