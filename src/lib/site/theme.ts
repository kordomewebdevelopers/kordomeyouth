import { isTheme, type Theme } from "$store/theme";
import type { Cookies } from "@sveltejs/kit";

export const themeCookie = (cookies: Cookies): Theme => {
  const theme = cookies.get("theme");

  return isTheme(theme) ? theme : "night";
};
