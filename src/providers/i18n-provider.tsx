import { DirectionProvider } from "@radix-ui/react-direction";
import { useTranslation } from "react-i18next";

const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();

  return <DirectionProvider dir={i18n.dir(i18n.language)}>{children}</DirectionProvider>;
};

export default I18nProvider;
