import { useTranslation } from "react-i18next";
import { Toaster } from "sonner";

const ToastProvider = () => {
  const { i18n } = useTranslation();
  return <Toaster richColors position={i18n.dir() === "rtl" ? "bottom-left" : "bottom-right"} />;
};

export default ToastProvider;
