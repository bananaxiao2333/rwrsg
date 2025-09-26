import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh from "./locales/zh-CN/trans.json";
import en from "./locales/en-US/trans.json";

// 尝试从 localStorage 中获取保存的语言设置，如果没有则使用默认值 'zh'
const savedLanguage = localStorage.getItem("lang") || "zh";

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage, // 关键：使用从 localStorage 读取的语言作为初始语言
  fallbackLng: "zh",
  debug: true,
  interpolation: {
    escapeValue: false, // React 已经默认转义了，防止 XSS
  },
});

// 监听语言变化事件，并持久化到 localStorage
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
});

i18n.on("missingKey", (lngs, namespace, key, res) => {
  console.log(lngs);
});

export default i18n;
