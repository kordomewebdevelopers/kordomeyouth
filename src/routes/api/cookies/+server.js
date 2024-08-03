import { json } from "@sveltejs/kit";
import { TEN_YEARS_IN_SECONDS } from "$lib/client/constants";
import { dev } from "$app/environment";

export const POST = async ({ cookies }) => {
  cookies.set("cookieNotice", "true", {
    path: "/",
    maxAge: TEN_YEARS_IN_SECONDS,
    secure: !dev,
  });

  return json(true);
};
