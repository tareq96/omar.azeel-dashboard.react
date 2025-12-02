import * as React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

type Props = {
  priceIronOnly: string;
  setPriceIronOnly: React.Dispatch<React.SetStateAction<string>>;
  priceDryClean: string;
  setPriceDryClean: React.Dispatch<React.SetStateAction<string>>;
};

export default function EditPriceStep({
  priceIronOnly,
  setPriceIronOnly,
  priceDryClean,
  setPriceDryClean,
}: Props) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2">
        <label className="font-medium">
          {t("items.fields.price_iron_only", { defaultValue: "Price Iron only" })}
        </label>
        <Input
          type="number"
          min={0}
          step="0.01"
          value={priceIronOnly}
          onChange={(e) => setPriceIronOnly(e.target.value)}
          placeholder={
            t("items.placeholders.price_iron_only", { defaultValue: "Enter price" }) as string
          }
        />
      </div>
      <div className="grid grid-cols-1 gap-2">
        <label className="font-medium">
          {t("items.fields.price_dry_clean", { defaultValue: "Price Dry clean only" })}
        </label>
        <Input
          type="number"
          min={0}
          step="0.01"
          value={priceDryClean}
          onChange={(e) => setPriceDryClean(e.target.value)}
          placeholder={
            t("items.placeholders.price_dry_clean", { defaultValue: "Enter price" }) as string
          }
        />
      </div>
    </div>
  );
}
