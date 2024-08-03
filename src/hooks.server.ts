import { sequence } from "@sveltejs/kit/hooks";
import { redirect, type Handle } from "@sveltejs/kit";
import { POCKETBASE_URL } from "$env/static/private";
import { themeCookie } from "$lib/site/theme";
import PocketBase from "pocketbase";
import { dev } from "$app/environment";
import { getUser } from "$lib/server/user";

const authentication: Handle = async ({ event, resolve }) => {
  event.locals.pb = new PocketBase(POCKETBASE_URL);

  event.locals.pb.authStore.loadFromCookie(
    event.request.headers.get("cookie") || ""
  );

  try {
    if (!event.locals.pb.authStore.isAdmin) {
      event.locals.pb.authStore.isValid &&
        (await event.locals.pb.collection("users").authRefresh());
    }

    event.locals.authUser = event.locals.pb.authStore.isValid
      ? structuredClone(event.locals.pb.authStore.model)
      : undefined;

    const id = event.locals.authUser?.id || "";
    const email = event.locals.authUser?.email || "";
    const { cookies } = event;

    event.locals.user = await getUser(id, email, cookies);
  } catch (_) {
    event.locals.pb.authStore.clear();
  }

  const response = await resolve(event);

  response.headers.append(
    "set-cookie",
    event.locals.pb.authStore.exportToCookie({ secure: !dev })
  );

  return response;
};

const storages: Handle = async ({ event, resolve }) => {
  event.locals.theme = themeCookie(event.cookies);

  return resolve(event);
};

const authorization: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;
  const { isAdmin } = event.locals.pb.authStore;

  if (pathname.startsWith("/admin/") && !isAdmin) {
    redirect(303, "/");
  }

  if (pathname.startsWith("/dash") && !event.locals.authUser) {
    redirect(303, "/auth/signin?tab=login");
  }

  return resolve(event);
};

export const handle = sequence(storages, authentication, authorization);
