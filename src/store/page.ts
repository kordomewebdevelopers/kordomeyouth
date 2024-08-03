import { writable } from "svelte/store";

export const tabbed = writable<string | number>("");
