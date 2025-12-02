import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

export interface TabSelectorProps {
  activeTab: "Mobile" | "Walkin";
  onTabChange: (tab: "Mobile" | "Walkin") => void;
}

export function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
  const { t } = useTranslation();

  return (
    <Tabs value={activeTab} onValueChange={(val) => onTabChange(val as "Mobile" | "Walkin")}>
      <TabsList>
        <TabsTrigger value="Mobile">{t("dashboard.summary.tabs.mobile")}</TabsTrigger>
        <TabsTrigger value="Walkin">{t("dashboard.summary.tabs.walkin")}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
