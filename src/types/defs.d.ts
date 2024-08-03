export type Flash = { type: "success" | "error"; message: string };

export type DataOfferID = "mtn_evd" | "telecel_data" | "at_data" | "mtn_data";

export type DataOffer = {
  title: string;
  desc: string;
  id: DataOfferID;
  disabled: boolean;
  thumbnail: string;
  network: string;
};

export type DashLinkTypes = {
  disabled: boolean;
  link: string;
  title: string;
  info: string;
};
