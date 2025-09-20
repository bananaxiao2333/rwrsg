import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh from "./locales/zh-CN/trans.json";
import en from "./locales/en-US/trans.json";

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: "zh",
    debug: true,
  });

i18n.on("missingKey", (lngs, namespace, key, res) => {
  console.log(lngs);
});

export default i18n;
