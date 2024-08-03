import { buildClient } from "@xata.io/client";
import type { BaseClientOptions } from "@xata.io/client";
import { type DatabaseSchema, tables } from "./schema";

const defaultOptions = {
  databaseURL:
    "https://khekheli-s-workspace-ujim6v.eu-west-1.xata.sh/db/khekheli",
};

export class XataClient extends buildClient()<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => (instance ? instance : new XataClient());
