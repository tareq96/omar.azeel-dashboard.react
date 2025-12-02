import * as React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  customerName?: string;
  statusLabel: string;
  code: string;
  lockerNumber: string;
  dynamicId: string;
  lockerPassword: string;
  imagePreview: string;
  documentPreview: string;
  notes: string;
  address: string;
  lat: string;
  lng: string;
};

export default function ConfirmationStep({
  customerName,
  statusLabel,
  code,
  lockerNumber,
  dynamicId,
  lockerPassword,
  imagePreview,
  documentPreview,
  notes,
  address,
  lat,
  lng,
}: Props) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <div className="text-muted-foreground text-xs">
            {t("lockers.fields.customer", { defaultValue: "Customer" })}
          </div>
          <div className="font-medium">{customerName || "-"}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {t("lockers.fields.status", { defaultValue: "Status" })}
          </div>
          <div className="font-medium">{statusLabel || "-"}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {t("lockers.fields.code", { defaultValue: "Locker Number" })}
          </div>
          <div className="font-medium">{code || "-"}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {t("lockers.fields.lockerNumberOptional", { defaultValue: "Locker Number (Optional)" })}
          </div>
          <div className="font-medium">{lockerNumber || "-"}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {t("lockers.fields.dynamicId", { defaultValue: "Dynamic ID" })}
          </div>
          <div className="font-medium">{dynamicId || "-"}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {t("lockers.fields.password", { defaultValue: "Locker Password" })}
          </div>
          <div className="font-medium">{lockerPassword || "-"}</div>
        </div>
        <div className="md:col-span-2">
          <div className="text-muted-foreground text-xs">
            {t("lockers.fields.address", { defaultValue: "Address" })}
          </div>
          <div className="font-medium">{address || "-"}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {t("lockers.fields.lat", { defaultValue: "Latitude" })}
          </div>
          <div className="font-medium">{lat || "-"}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {t("lockers.fields.lng", { defaultValue: "Longitude" })}
          </div>
          <div className="font-medium">{lng || "-"}</div>
        </div>
        <div className="md:col-span-2">
          <div className="text-muted-foreground text-xs">
            {t("lockers.fields.notes", { defaultValue: "Notes (Optional)" })}
          </div>
          <div className="font-medium whitespace-pre-wrap">{notes || "-"}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {t("lockers.fields.image", { defaultValue: "Image" })}
          </div>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="preview"
              className="mt-1 h-24 w-24 rounded border object-cover"
            />
          ) : (
            <div className="font-medium">-</div>
          )}
        </div>
        <div>
          <div className="text-muted-foreground text-xs">
            {t("lockers.fields.document", { defaultValue: "Document" })}
          </div>
          {documentPreview ? (
            <a
              href={documentPreview}
              target="_blank"
              rel="noreferrer"
              className="text-primary mt-1 underline"
            >
              {t("lockers.addDialog.viewDocument", { defaultValue: "View selected document" })}
            </a>
          ) : (
            <div className="font-medium">-</div>
          )}
        </div>
      </div>
    </div>
  );
}
