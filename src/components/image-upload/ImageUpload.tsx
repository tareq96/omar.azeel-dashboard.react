import { X } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  type FileUploadRootProps,
  FileUploadTrigger,
} from "@/components/ui/extension/file-upload";
import { UploadIcon } from "@/components/ui/icons";

import { ImageCropUI } from "./ImageCropContent";

// Helper function to convert data URL to File
const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

type ImageUploadProps = {
  onUploadSuccess: (attachment_id: number, attachmentUrl?: string) => void;
  doUpload: (
    file: File,
    options: {
      onProgress: (progress: number) => void;
      onSuccess: (
        attachmentId: number,
        attachmentUrl: string,
        attachmentPublicUrl?: string,
      ) => void;
      onError: (error: Error) => void;
      isPublic?: boolean;
    },
  ) => void;
  isPublic?: boolean;
  maxImages?: number;
  maxImageSize?: number;
  title: string;
  description?: string;
  disabled?: boolean;
  enableCrop?: boolean;
  cropAspect?: number;
  cropMaxSize?: number;
  withProgress?: boolean;
};

export function ImageUpload({
  doUpload,
  onUploadSuccess,
  isPublic = false,
  maxImages = 1,
  maxImageSize,
  title,
  description,
  disabled,
  enableCrop = false,
  cropAspect = 1,
  cropMaxSize = 1024 * 1024,
  withProgress = true,
}: ImageUploadProps) {
  const { t } = useTranslation();
  const [files, setFiles] = React.useState<File[]>([]);
  const [isCropping, setIsCropping] = React.useState(false);
  const [fileToCrop, setFileToCrop] = React.useState<File | null>(null);
  const [croppedImage, setCroppedImage] = React.useState<string | null>(null);

  const onFileReject = React.useCallback(
    (file: File, message: string) => {
      toast.error(message, {
        description: t("upload.fileRejectedDescription", {
          name: file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name,
        }),
      });
    },
    [t],
  );

  const onUpload: NonNullable<FileUploadRootProps["onUpload"]> = React.useCallback(
    async (files, { onProgress, onSuccess, onError }) => {
      for (const file of files) {
        try {
          // If crop is enabled, show crop interface - DON'T upload yet
          if (enableCrop) {
            setFileToCrop(file);
            setIsCropping(true);
            // Store callbacks to use after cropping
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (file as any).__uploadCallbacks = { onProgress, onSuccess, onError };
            return;
          }

          // Normal upload flow (no crop)
          doUpload(file, {
            onProgress: (progress) => {
              onProgress(file, progress);
            },
            onSuccess: (attachmentId, attachmentUrl, attachmentPublicUrl) => {
              onSuccess(file);
              onUploadSuccess(attachmentId, isPublic ? attachmentPublicUrl : attachmentUrl);
            },
            onError: (error) => {
              onError(file, error);
            },
            isPublic,
          });
        } catch (error) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onError(file, error);
        }
      }
    },
    [enableCrop, doUpload, onUploadSuccess, isPublic],
  );

  const handleCropImageComplete = (croppedDataUrl: string) => {
    setCroppedImage(croppedDataUrl);
  };

  const handleCropApply = React.useCallback(() => {
    if (!croppedImage || !fileToCrop) return;

    // Get the stored callbacks from the original file
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callbacks = (fileToCrop as any).__uploadCallbacks;
    if (!callbacks) return;

    const croppedFile = dataURLtoFile(croppedImage, fileToCrop.name);

    // Reset crop state and switch back to upload view
    setIsCropping(false);
    setFileToCrop(null);
    setCroppedImage(null);

    // Add cropped file to files state to show in the UI
    setFiles([croppedFile]);

    // Now actually upload using the stored callbacks
    doUpload(croppedFile, {
      onProgress: (progress) => {
        callbacks.onProgress(croppedFile, progress);
      },
      onSuccess: (attachmentId, attachmentUrl, attachmentPublicUrl) => {
        callbacks.onSuccess(croppedFile);
        onUploadSuccess(attachmentId, isPublic ? attachmentPublicUrl : attachmentUrl);
      },
      onError: (error) => {
        callbacks.onError(croppedFile, error);
      },
      isPublic,
    });
  }, [croppedImage, fileToCrop, doUpload, onUploadSuccess, isPublic]);

  const handleCropCancel = React.useCallback(() => {
    setFiles([]);
    setIsCropping(false);
    setFileToCrop(null);
    setCroppedImage(null);
  }, []);

  // Render crop interface inline
  if (isCropping && fileToCrop) {
    return (
      <ImageCropUI
        file={fileToCrop}
        cropAspect={cropAspect}
        cropMaxSize={cropMaxSize}
        croppedImage={croppedImage}
        onCropComplete={handleCropImageComplete}
        onApply={handleCropApply}
        onCancel={handleCropCancel}
      />
    );
  }

  // Normal upload interface
  return (
    <FileUpload
      maxFiles={maxImages}
      maxSize={maxImageSize}
      value={files}
      onValueChange={setFiles}
      onUpload={onUpload}
      onFileReject={onFileReject}
      multiple={maxImages > 1}
      disabled={files.length >= maxImages || disabled}
      accept="image/*"
    >
      <FileUploadDropzone className={"bg-[#F8F9FACC] dark:bg-black/80"}>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center justify-center rounded-full p-2.5">
            <UploadIcon className="text-muted-foreground size-8" />
          </div>
          <p className="text-sm font-medium">{title}</p>
          {description && <p className="text-muted-foreground text-xs">{description}</p>}
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit border bg-[#F8F9FACC] text-sm">
            {t("upload.button")}
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file, index) => (
          <FileUploadItem key={index} value={file} className="flex-col">
            <div className="flex w-full items-center gap-2">
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" className="size-7">
                  <X />
                </Button>
              </FileUploadItemDelete>
            </div>
            {withProgress && <FileUploadItemProgress />}
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
