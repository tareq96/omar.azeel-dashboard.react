import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent as ImageCropContentBase,
  ImageCropReset,
} from "@/components/ui/extension/image-crop";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ImageCropUIProps {
  file: File;
  cropAspect?: number;
  cropMaxSize?: number;
  croppedImage: string | null;
  onCropComplete: (croppedDataUrl: string) => void;
  onApply: () => void;
  onCancel: () => void;
}

export function ImageCropUI({
  file,
  cropAspect = 1,
  cropMaxSize = 1024 * 1024,
  croppedImage,
  onCropComplete,
  onApply,
  onCancel,
}: ImageCropUIProps) {
  const { t } = useTranslation();

  if (!croppedImage) {
    return (
      <ImageCrop
        aspect={cropAspect}
        file={file}
        maxImageSize={cropMaxSize}
        onCrop={onCropComplete}
        className="flex flex-col items-center justify-center gap-4"
      >
        <ImageCropContentBase className="max-w-full" />
        <div className="flex items-center justify-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ImageCropReset />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("upload.crop.reset")}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onCancel} size="icon" variant="ghost">
                  <X className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("upload.crop.cancel")}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <ImageCropApply />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("upload.crop.apply")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </ImageCrop>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <img alt="Cropped preview" className="max-h-64 rounded-lg border" src={croppedImage} />
      </div>
      <div className="flex items-center justify-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onCancel} size="icon" variant="ghost">
                <X className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("upload.crop.cancel")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button onClick={onApply}>{t("upload.button")}</Button>
      </div>
    </div>
  );
}
