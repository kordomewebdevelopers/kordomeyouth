import type { Theme } from "$store/theme";
import type { MetaSchema } from "$lib/site";
import PocketBase, { type AuthModel } from "pocketbase";
import type { User } from "$types/user";

declare global {
  interface Document {
    startViewTransition?(callback: () => Promise<void>): void;
  }

  namespace App {
    interface Locals {
      user: User;
      theme: Theme;
      pb: PocketBase;
      authUser: AuthModel | undefined;
    }

    interface PageData {
      user: User;
      authUser: AuthModel | undefined;
      meta: MetaSchema;
      isAdmin: boolean;
    }

    interface Platform {
      env: { db: D1Database };
      context: { waitUntil(promise: Promise<any>): void };
      caches: CacheStorage & { default: Cache };
    }

    // interface PageState {}
    // interface Error {}
  }
}

export {};
