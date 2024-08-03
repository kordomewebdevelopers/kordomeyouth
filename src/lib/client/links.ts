import { creditCardIcon, giftCardIcon, storeIcon } from "$lib/client/icons";
import { settingsIcon, circleDashIcon } from "$lib/client/icons";
import { gameIcon, personIcon } from "$lib/client/icons";
import { squarePlusIcon, cashoutIcon, walletIcon } from "$lib/client/icons";
import { cursorArrowIcon, shopIcon } from "$lib/client/icons";

export const dashLinks = [
  {
    disabled: false,
    link: "/studio",
    title: "ad studio",
    ds: cursorArrowIcon,
    info: "",
  },
  {
    title: "affiliates",
    ds: cashoutIcon,
    disabled: false,
    link: "/affiliates",
    info: "",
  },
  {
    title: "updates",
    ds: circleDashIcon,
    disabled: false,
    link: "/updates",
    info: "",
  },
  {
    title: "games",
    ds: gameIcon,
    disabled: false,
    link: "/games",
    info: "",
  },

  {
    title: "services",
    ds: squarePlusIcon,
    disabled: false,
    link: "/services",
    info: "",
  },

  {
    title: "shops",
    ds: shopIcon,
    disabled: false,
    link: "/shops",
    info: "",
  },
  {
    title: "offers",
    ds: giftCardIcon,
    disabled: false,
    link: "/offers",
    info: "hot",
  },

  {
    title: "payments",
    ds: creditCardIcon,
    disabled: false,
    link: "/dash/payments",
    info: "",
  },
  {
    title: "wallet",
    ds: walletIcon,
    disabled: false,
    link: "/dash/wallet",
    info: "",
  },
  {
    title: "orders",
    ds: storeIcon,
    disabled: false,
    link: "/orders",
    info: "",
  },
  {
    disabled: false,
    link: "/dash/profiles",
    title: "profiles",
    ds: personIcon,
    info: "",
  },
  {
    title: "settings",
    ds: settingsIcon,
    disabled: false,
    link: "/dash/settings",
    info: "",
  },
];

export const affiliateLinks = [
  {
    disabled: false,
    link: "/affiliates/promotions",
    title: "promotions",
    info: "new",
  },

  {
    disabled: false,
    link: "/explore/campaigns",
    title: "explore campaigns",
    info: "",
  },

  {
    title: "paid surveys",
    disabled: true,
    link: "/affiliate/surveys",
    info: "soon",
  },
  {
    title: "social tasks",
    disabled: true,
    link: "/affiliates/tasks",
    info: "soon",
  },
];

export const studioLinks = [
  {
    disabled: false,
    link: "/studio/campaigns",
    title: "create campaigns",
    info: "new",
  },

  {
    disabled: true,
    link: "/studio/surveys",
    title: "create surveys",
    info: "soon",
  },

  {
    title: "create forms",
    disabled: true,
    link: "/studio/forms",
    info: "soon",
  },
  {
    title: "social tasks",
    disabled: true,
    link: "/studio/tasks",
    info: "soon",
  },
];

export const adminLinks = [
  {
    title: "campaign reviews",
    info: "",
    disabled: false,
    link: "/admin/campaigns",
  },
  {
    title: "promotion reviews",
    info: "",
    disabled: false,
    link: "/admin/promotions",
  },
  {
    title: "cashout requests",
    info: "",
    disabled: false,
    link: "/admin/cashout",
  },
  {
    title: "recent orders",
    info: "",
    disabled: false,
    link: "/admin/orders",
  },
  {
    title: "platform stats",
    info: "",
    disabled: false,
    link: "/admin/platform",
  },
];

export const platformLinks = [
  {
    title: "cashout stats",
    info: "",
    disabled: false,
    link: "/admin/platform/cashouts",
  },
  {
    title: "order stats",
    info: "",
    disabled: false,
    link: "/admin/platform/orders",
  },
  {
    title: "campaign stats",
    info: "",
    disabled: false,
    link: "/admin/platform/campaigns",
  },
  {
    title: "promotion stats",
    info: "",
    disabled: false,
    link: "/admin/platform/promotions",
  },
];

export const policyLinks = [
  {
    title: "terms of use",
    info: "",
    disabled: false,
    link: "/policies/terms",
  },
  {
    title: "privacy policies",
    info: "",
    disabled: false,
    link: "/policies/privacy",
  },
  {
    title: "content policies",
    info: "",
    disabled: false,
    link: "/policies/content",
  },
  {
    title: "cookie policies",
    info: "",
    disabled: false,
    link: "/policies/cookies",
  },
];

export const navLinks = [
  { title: "home", href: "/home" },
  { title: "about us", href: "/about us" },
  { title: "contact us", href: "/contacts" },
  { title: "membership", href: "/membership" },
  { title: "blogs", href: "/blogs" },
  { title: "gallery", href: "/gallery" },
  { title: "resources", href: "/resources" },
];
