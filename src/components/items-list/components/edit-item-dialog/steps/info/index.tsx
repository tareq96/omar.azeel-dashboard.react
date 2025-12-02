import * as React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

type Props = {
  name: string;
  dynamicId: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setDynamicId: React.Dispatch<React.SetStateAction<string>>;
  canProceedInfo: boolean;
};

export default function EditInfoStep({
  name,
  dynamicId,
  setName,
  setDynamicId,
  canProceedInfo,
}: Props) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2">
        <label className="font-medium">{t("items.fields.name", { defaultValue: "Name" })}</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("items.placeholders.name", { defaultValue: "Enter name" }) as string}
        />
      </div>
      <div className="grid grid-cols-1 gap-2">
        <label className="font-medium">
          {t("items.fields.dynamic_id", { defaultValue: "ID Ghaseelcom" })}
        </label>
        <Input
          value={dynamicId}
          onChange={(e) => setDynamicId(e.target.value)}
          placeholder={
            t("items.placeholders.dynamic_id", { defaultValue: "Enter Ghaseelcom ID" }) as string
          }
        />
      </div>
    </div>
  );
}
