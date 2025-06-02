import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";
import { __dirname } from "../server.js";

export const setupI18n = async () => {
  await i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
      fallbackLng: "en",
      preload: ["en", "fa"],
      supportedLngs: ["en", "fa"],
      ns: ["translation"],
      defaultNS: "translation",
      backend: {
        loadPath: path.join(
          __dirname,
          "locales/{{lng}}/translation.json"
        ),
      },
      detection: {
        order: ["querystring", "cookie", "header"],
        caches: ["cookie"],
      },
      ns: ["translation"],
      defaultNS: "translation",
    });

  return middleware.handle(i18next);
};
