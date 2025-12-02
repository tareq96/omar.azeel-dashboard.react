import * as React from "react";
import { useTranslation } from "react-i18next";
import { ImageUpload } from "@/components/image-upload/ImageUpload";

type Props = {
  form: any;
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
    },
    [setImageFile],
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2">
        <label className="font-medium">{t("customers.addDialog.fields.image")}</label>
        <ImageUpload
          doUpload={doUpload}
          title={t("customers.addDialog.fields.image")}
          description={t("customers.addDialog.imageUploadDescription")}
          maxImages={1}
          onUploadSuccess={() => {}}
        />
      </div>
    </div>
  );
}
