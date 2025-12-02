import * as React from "react";
import { useTranslation } from "react-i18next";
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload/ImageUpload";

type CustomerOption = {
  id: number;
  name: string;
  zone_id: string;
  zone_address: string;
  zone_lat: string;
  zone_lng: string;
};

type Props = {
  customersOptions: CustomerOption[];
  customerId?: number;
  setCustomerId: (id: number) => void;
  customersSearch: string;
  setCustomersSearch: (v: string) => void;
  statuses: { value: string; label: string }[];
  status: string;
  setStatus: (v: string) => void;
  code: string;
  setCode: (v: string) => void;
  lockerNumber: string;
  setLockerNumber: (v: string) => void;
  dynamicId: string;
  setDynamicId: (v: string) => void;
  lockerPassword: string;
  setLockerPassword: (v: string) => void;
  imagePreview: string;
  setImageFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  documentPreview: string;
  setDocumentFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  notes: string;
  setNotes: (v: string) => void;
  canProceedInfo: boolean;
};

export default function InfoStep({
  customersOptions,
  customerId,
  setCustomerId,
  customersSearch,
  setCustomersSearch,
  statuses,
  status,
  setStatus,
  code,
  setCode,
  lockerNumber,
  setLockerNumber,
  dynamicId,
  setDynamicId,
  lockerPassword,
  setLockerPassword,
  imagePreview,
  setImageFile,
  documentPreview,
  setDocumentFile,
  notes,
  setNotes,
  canProceedInfo,
}: Props) {
  const { t } = useTranslation();

  const customerOptionsUi = customersOptions.map((c) => ({
    label: `${c.name} — ${c.zone_address}`,
    value: String(c.id),
  }));

  const doUploadImage = React.useCallback(
    (
      file: File,
      {
        onProgress,
        onSuccess,
      }: {
        onProgress: (progress: number) => void;
        onSuccess: (
          attachmentId: number,
          attachmentUrl: string,
          attachmentPublicUrl?: string,
        ) => void;
      },
    ) => {
      setImageFile(file);
      onProgress(100);
      const url = URL.createObjectURL(file);
      onSuccess(0, url);
    },
    [setImageFile],
  );

  const doUploadDocument = React.useCallback(
    (
      file: File,
      {
        onProgress,
        onSuccess,
      }: {
        onProgress: (progress: number) => void;
        onSuccess: (
          attachmentId: number,
          attachmentUrl: string,
          attachmentPublicUrl?: string,
        ) => void;
      },
    ) => {
      setDocumentFile(file);
      onProgress(100);
      const url = URL.createObjectURL(file);
      onSuccess(0, url);
    },
    [setDocumentFile],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="font-medium">
            {t("lockers.fields.customer", { defaultValue: "Customer" })}
          </label>
          <Combobox
            options={customerOptionsUi}
            value={customerId ? String(customerId) : undefined}
            onChange={(v) => {
              if (!v) return setCustomerId(undefined as any);
              setCustomerId(Number(v));
            }}
            placeholder={t("common.select", { defaultValue: "Select" })}
            className="w-full"
            searchValue={customersSearch}
            onSearchChange={(val) => setCustomersSearch(val)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">
            {t("lockers.fields.status", { defaultValue: "Status" })}
          </label>
          <Select value={status} onValueChange={(v) => setStatus(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.select", { defaultValue: "Select" })} />
            </SelectTrigger>
            <SelectContent className="z-9999">
              {statuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">
            {t("lockers.fields.code", { defaultValue: "Locker Code" })}
          </label>
          <Input value={code} readOnly className="bg-muted" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">
            {t("lockers.fields.dynamicId", { defaultValue: "Dynamic ID" })}
          </label>
          <Input value={dynamicId} onChange={(e) => setDynamicId(e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">
            {t("lockers.fields.password", { defaultValue: "Locker Password" })}
          </label>
          <Input value={lockerPassword} onChange={(e) => setLockerPassword(e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">
            {t("lockers.fields.lockerNumberOptional", {
              defaultValue: "Physical Locker # (Optional)",
            })}
          </label>
          <Input
            value={lockerNumber}
            onChange={(e) => setLockerNumber(e.target.value)}
            placeholder="e.g., L-001"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-medium">
            {t("lockers.fields.image", { defaultValue: "Image" })}
          </label>
          <ImageUpload
            doUpload={doUploadImage}
            title={t("lockers.fields.image", { defaultValue: "Image" })}
            description={t("lockers.addDialog.imageUploadDescription", {
              defaultValue: "Upload locker image (optional)",
            })}
            maxImages={1}
            onUploadSuccess={() => {}}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="h-24 w-24 rounded border object-cover"
            />
          )}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-medium">
            {t("lockers.fields.document", { defaultValue: "Document" })}
          </label>
          <ImageUpload
            doUpload={doUploadDocument}
            title={t("lockers.fields.document", { defaultValue: "Document" })}
            description={t("lockers.addDialog.documentUploadDescription", {
              defaultValue: "Upload locker document (optional)",
            })}
            maxImages={1}
            onUploadSuccess={() => {}}
          />
          {documentPreview && (
            <a
              href={documentPreview}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              {t("lockers.addDialog.viewDocument", { defaultValue: "View selected document" })}
            </a>
          )}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-medium">
            {t("lockers.fields.notes", { defaultValue: "Notes (Optional)" })}
          </label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
