import { AppProvider } from "@shopify/polaris";
import { LinkLikeComponent } from "@shopify/polaris/build/ts/latest/src/utilities/link";
import da from "@shopify/polaris/locales/da.json";
import en from "@shopify/polaris/locales/en.json";
import { I18nContext, I18nManager, useI18n } from "@shopify/react-i18n";
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  SettingsContext,
  SettingsContextValues,
  defaultValues,
} from "./settings-context";

export type SettingsProviderProps = {
  children: ReactNode;
  value?: SettingsContextValues;
};

export const SettingsProvider = ({
  children,
  value,
}: SettingsProviderProps) => {
  const [data, setData] = useState<SettingsContextValues>(defaultValues);

  const update = useCallback(
    (values: Partial<Omit<SettingsContextValues, "update">>) =>
      setData((prev) => ({ ...prev, ...values })),
    [],
  );

  useEffect(() => {
    if (value) {
      update(value);
    }
  }, [update, value]);

  return (
    <SettingsContext.Provider value={{ ...data, update }}>
      <I18nProvider>
        <PolarisProvider linkComponent={value?.LinkComponent}>
          {children}
        </PolarisProvider>
      </I18nProvider>
    </SettingsContext.Provider>
  );
};

export interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const { language } = useContext(SettingsContext);

  const manager = useMemo(
    () =>
      new I18nManager({
        locale: language,
        onError: (details) => {
          // eslint-disable-next-line no-console
          console.log(details);
        },
      }),
    [language],
  );

  useEffect(() => {
    if (language) {
      manager.update({ locale: language });
    }
  }, [language, manager]);

  return (
    <I18nContext.Provider value={manager}>{children}</I18nContext.Provider>
  );
};

export interface PolarisProviderProps {
  children: ReactNode;
  linkComponent?: LinkLikeComponent;
}

export const PolarisProvider = ({
  children,
  ...props
}: PolarisProviderProps) => {
  const [i18n] = useI18n({
    fallback: da,
    id: "Polaris",
    async translations(locale) {
      return locale === "en" ? en : da;
    },
  });

  return (
    <AppProvider
      i18n={i18n.locale === "da" ? i18n.translations[0] : i18n.translations[1]}
      {...props}
    >
      {children}
    </AppProvider>
  );
};
