import { writable } from "svelte/store";

const themes = ["auto", "light", "dark", "night", "system"] as const;

export type Theme = (typeof themes)[number];

export const isTheme = (theme: unknown): theme is Theme => {
  return typeof theme === "string" && themes.includes(theme as Theme);
};

export const theme = writable<Theme>("dark");
export const cookieNotice = writable("");
