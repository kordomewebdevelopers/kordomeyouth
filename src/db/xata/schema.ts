import type { SchemaInference, XataRecord } from "@xata.io/client";

const campaignSchema = {
  name: "campaigns",
  columns: [
    { name: "promotions", type: "int", notNull: true, defaultValue: "0" },
    { name: "views", type: "int", notNull: true, defaultValue: "0" },
    { name: "clicks", type: "int", notNull: true, defaultValue: "0" },
    {
      name: "status",
      type: "string",
      notNull: true,
      defaultValue: "pending",
    },
    { name: "transact_id", type: "string", notNull: true, defaultValue: "" },
    { name: "created_at", type: "int", notNull: true, defaultValue: "0" },
    { name: "max", type: "int", notNull: true, defaultValue: "0" },
    { name: "budget", type: "int", notNull: true, defaultValue: "0" },
    { name: "format", type: "string", notNull: true, defaultValue: "none" },
    { name: "label", type: "string", notNull: true, defaultValue: "" },
    { name: "link", type: "string", notNull: true, defaultValue: "" },
    { name: "file", type: "string", notNull: true, defaultValue: "" },
    {
      name: "advertiser_id",
      type: "string",
      notNull: true,
      defaultValue: "",
    },
    {
      name: "reach",
      type: "string",
      notNull: true,
      defaultValue: "nationwide",
    },
    { name: "submissions", type: "int", notNull: true, defaultValue: "0" },
  ],
} as const;

const promotionSchema = {
  name: "promotions",
  columns: [
    { name: "views", type: "int", notNull: true, defaultValue: "0" },
    { name: "user_id", type: "string", notNull: true, defaultValue: "" },
    { name: "earn", type: "float", notNull: true, defaultValue: "0" },
    { name: "file", type: "string", notNull: true, defaultValue: "" },
    {
      name: "status",
      type: "string",
      notNull: true,
      defaultValue: "running",
    },
    {
      name: "campaign_file",
      type: "string",
      notNull: true,
      defaultValue: "",
    },
    {
      name: "created_at",
      type: "datetime",
      notNull: true,
      defaultValue: "now",
    },
    { name: "campaign_id", type: "string", notNull: true, defaultValue: "" },
    { name: "metadata", type: "json" },
  ],
} as const;

export const tables = [campaignSchema, promotionSchema];

type SchemaTables = typeof tables;
type InferredTypes = SchemaInference<SchemaTables>;
type Campaigns = InferredTypes["campaigns"];
type Promotions = InferredTypes["promotions"];

export type Campaign = Campaigns & XataRecord;
export type Promotion = Promotions & XataRecord;
export type DatabaseSchema = { campaigns: Campaign; promotions: Promotion };
