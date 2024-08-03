import { randomItem } from "$helpers/arrays";

export type MetaSchema = {
  title: string;
  image: string;
  description: string;
  fullPath: boolean;
};

const images = ["39ba7181", "7524150c"];

export const site: MetaSchema = {
  title: "Delivering convenience and growth opportunities",
  description: "",
  image: `images/${randomItem(images)}.jpg`,
  fullPath: false,
};

export const whatsappGroupLink = {
  affiliate: "https://chat.whatsapp.com/FGhbJLLmnzqGnOci47IWTn",
  business: "https://chat.whatsapp.com/JoJWDAP4kJJ4xs7enkGKBS",
};
