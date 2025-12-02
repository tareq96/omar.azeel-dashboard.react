import * as React from "react";
import { useTranslation } from "react-i18next";
import { ImageUpload } from "@/components/image-upload/ImageUpload";

type Props = {
  iconPreview: string;
  setIconFile: React.Dispatch<React.SetStateAction<File | undefined>>;
};

export default function IconStep({ iconPreview, setIconFile }: Props) {
  const { t } = useTranslation();
  const doUpload = React.useCallback(
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
      setIconFile(file);
      onProgress(100);
      const url = URL.createObjectURL(file);
      onSuccess(0, url);
    },
    [setIconFile],
  );
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2">
        <label className="font-medium">{t("items.fields.icon", { defaultValue: "Icon" })}</label>
        <ImageUpload
          doUpload={doUpload}
          title={t("items.fields.icon", { defaultValue: "Icon" })}
          description={t("items.addDialog.iconUploadDescription", {
            defaultValue: "Upload item icon (optional)",
          })}
          maxImages={1}
          onUploadSuccess={() => {}}
        />
      </div>
    </div>
  );
}
