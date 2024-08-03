import { json } from "@sveltejs/kit";
import { TEN_YEARS_IN_SECONDS } from "$lib/client/constants";

export const POST = async ({ request, cookies }) => {
  const formData = await request.formData();
  const theme = formData.get("theme") || "dark";

  cookies.set("theme", `${theme}`, {
    path: "/",
    maxAge: TEN_YEARS_IN_SECONDS,
    secure: request.url.startsWith("https"),
  });

  return json(theme);
};
