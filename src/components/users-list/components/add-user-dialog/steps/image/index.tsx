import * as React from "react";
import { type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ImageUpload } from "@/components/image-upload/ImageUpload";

type Props = {
  form: any; // Simplified to support both create and update forms
  setImageFile: React.Dispatch<React.SetStateAction<File | undefined>>;
};

export default function ImageStep({ form, setImageFile }: Props) {
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
      setImageFile(file);
      onProgress(100);
      const url = URL.createObjectURL(file);
      onSuccess(0, url);
      // We don't need to set the form value since we're using FormData
    },
    [setImageFile],
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2">
        <label className="font-medium">{t("users.addDialog.fields.image")}</label>
        <ImageUpload
          doUpload={doUpload}
          title={t("users.addDialog.fields.image")}
          description={t("users.addDialog.imageUploadDescription")}
          maxImages={1}
          onUploadSuccess={() => {}}
        />
      </div>
    </div>
  );
}
