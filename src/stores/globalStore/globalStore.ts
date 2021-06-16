import i18n from "i18next";
import { createState } from "@hookstate/core";

export const isMobileGlobal = createState(
  window.innerWidth < 768 ? true : false,
);

export const languageGlobal = createState(
  i18n.language || window.localStorage.i18nextLng || window.navigator.language
    ? (
        i18n.language ||
        window.localStorage.i18nextLng ||
        window.navigator.language
      ).slice(0, 2)
    : "en",
);
