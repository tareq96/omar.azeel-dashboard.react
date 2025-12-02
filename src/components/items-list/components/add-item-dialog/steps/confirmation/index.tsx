import * as React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  name: string;
  dynamicId: string;
  priceIronOnly: string;
  priceDryClean: string;
  iconPreview: string;
};

export default function ConfirmationStep({
  name,
  dynamicId,
  priceIronOnly,
  priceDryClean,
  iconPreview,
}: Props) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-[180px_1fr] gap-x-4 gap-y-2">
      <span className="font-medium">{t("items.fields.name", { defaultValue: "Name:" })}</span>
      <span className="truncate">{name || "-"}</span>
      <span className="font-medium">
        {t("items.fields.dynamic_id", { defaultValue: "ID Ghaseelcom:" })}
      </span>
      <span className="truncate">{dynamicId || "-"}</span>
      <span className="font-medium">
        {t("items.fields.price_iron_only", { defaultValue: "Price Iron only:" })}
      </span>
      <span className="truncate">{priceIronOnly || "-"}</span>
      <span className="font-medium">
        {t("items.fields.price_dry_clean", { defaultValue: "Price Dry clean only:" })}
      </span>
      <span className="truncate">{priceDryClean || "-"}</span>
      <span className="font-medium">{t("items.fields.icon", { defaultValue: "Icon:" })}</span>
      <span>
        {iconPreview ? (
          <img src={iconPreview} alt="icon preview" className="h-16 w-16 rounded object-cover" />
        ) : (
          t("items.addDialog.iconPreviewEmpty", { defaultValue: "No icon selected" })
        )}
      </span>
    </div>
  );
}
