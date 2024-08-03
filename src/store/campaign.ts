import { CAMPAIGN_PER_VIEW } from "$lib/client/constants";
import { writable } from "svelte/store";

export type CampaignFormat = "wa_status" | "banner" | "video";

export type BannerType = {
  label: string;
  link: string;
  file: string;
  id: string;
};

export type CampaignType = {
  format: CampaignFormat;
  file: string;
  title: string;
  link: string;
  id: string;
  reach: string;
  budget: number;
  max: number;
  label: string;
};

export const campaignInit: CampaignType = {
  format: "wa_status",
  title: "",
  link: "",
  id: "",
  reach: "nationwide",
  budget: 0,
  max: 0,
  label: "",
  file: "",
};

export const campaign = writable<CampaignType>(campaignInit);

export const getMaxCampaign = (budget: number, format: CampaignFormat) => {
  return Math.floor(budget / CAMPAIGN_PER_VIEW[format]);
};
