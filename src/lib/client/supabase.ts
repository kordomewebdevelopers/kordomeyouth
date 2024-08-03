import { createBrowserClient, parse } from "@supabase/ssr";
import { createServerClient, isBrowser } from "@supabase/ssr";
import { PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import type { Session } from "@supabase/supabase-js";

export const getAuthSession = async (fetch: any, session: Session | null) => {
  const supabase = isBrowser()
    ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
        cookies: {
          get(key) {
            const cookie = parse(document.cookie);
            return cookie[key];
          },
        },
      })
    : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
        cookies: {
          get() {
            return JSON.stringify(session);
          },
        },
      });

  const { auth } = supabase;

  const { data } = await auth.getSession();

  return { auth, session: data.session };
};
