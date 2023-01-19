import { Button } from "@shopify/polaris";
import { useI18n } from "@shopify/react-i18n";
import React, { useState } from "react";
import { SettingsProvider } from "./settings-context-provider";
import "@shopify/polaris/build/esm/styles.css";

const locales = {
  da: {
    lang: "Dansk",
  },
  en: {
    lang: "English",
  },
};

const MockComponent = ({ setLanguage }) => {
  const [i18n] = useI18n({
    id: "settings",
    fallback: locales.da,
    translations: (locale: string) =>
      locale === "da" ? locales.da : locales.en,
  });

  return (
    <div>
      {i18n.translate("lang")}
      <br />
      <Button onClick={() => setLanguage("da")}>Danish</Button>
      <Button onClick={() => setLanguage("en")}>Engelsk</Button>
    </div>
  );
};

export const BasicThemeUsage = () => {
  const [language, setLanguage] = useState<string>("da");

  return (
    <SettingsProvider value={{ language: language, timeZone: "Europe" }}>
      <MockComponent setLanguage={setLanguage} />
    </SettingsProvider>
  );
};
