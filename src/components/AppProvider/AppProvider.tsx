import { i18n as TranlationType } from "i18next";
import { debounce, DebouncedFunc } from "lodash";
import { FC, memo, ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import {
  isMobileGlobal,
  languageGlobal,
} from "~stores/globalStore/globalStore";
import { useState } from "@hookstate/core";

export interface AppProviderProperties {
  children: ReactNode;
  translation: TranlationType;
}

const AppProvider: FC<AppProviderProperties> = ({
  children,
  translation,
}: AppProviderProperties): JSX.Element => {
  const isMobile = useState(isMobileGlobal);
  const language = useState(languageGlobal);
  useEffect(() => {
    const resizeHandler = (): void => {
      const isMobileSize: boolean = window.innerWidth < 768;
      isMobile.set(isMobileSize);
    };
    const resizeLinstenerHandler: DebouncedFunc<() => void> = debounce(
      resizeHandler,
      25,
    );
    addEventListener("resize", resizeLinstenerHandler);
    return (): void => {
      removeEventListener("resize", resizeLinstenerHandler);
    };
  }, [isMobile.get()]);
  useEffect(() => {
    translation.changeLanguage(language.get());
  }, [language.get()]);
  return (
    <I18nextProvider i18n={translation}>
      <HelmetProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </HelmetProvider>
    </I18nextProvider>
  );
};

export default memo(AppProvider);
