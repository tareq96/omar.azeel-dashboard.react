import * as React from "react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ResponsiveDialog, StepperFooterControls } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperNav,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperPanel,
  StepperContent,
} from "@/components/ui/stepper";
import { Check, ClipboardList, DollarSign, ImageIcon, Info, LoaderCircleIcon } from "lucide-react";
import { getItemsItemsListQueryKey } from "@/services/api/generated/items/items";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customInstance } from "@/services/api/base/orvalMutator";
import type { DataTableRowAction } from "@/types/data-table";
import type { ItemRow, ItemsDataTableRowAction } from "@/components/items-list/types";

import EditInfoStep from "./steps/info";
import EditPriceStep from "./steps/price";
import EditIconStep from "./steps/icon";
import EditConfirmationStep from "./steps/confirmation";

type EditItemDialogProps = {
  rowAction: DataTableRowAction<ItemRow, ItemsDataTableRowAction> | null;
  onClose: () => void;
};

export default function EditItemDialog({ rowAction, onClose }: EditItemDialogProps) {
  const open = Boolean(rowAction && rowAction.variant === "edit");
  const current = rowAction?.row?.original as ItemRow | undefined;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [dynamicId, setDynamicId] = useState("");
  const [priceIronOnly, setPriceIronOnly] = useState<string>("");
  const [priceDryClean, setPriceDryClean] = useState<string>("");
  const [iconFile, setIconFile] = useState<File | undefined>(undefined);
  const [iconPreview, setIconPreview] = useState<string>("");

  const updateMultipart = useMutation({
    mutationKey: ["adminItemsUpdatePostMethod"],
    mutationFn: async ({ item, data }: { item: number; data: FormData }) => {
      return customInstance<any>({
        url: `/items/${item}`,
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        data,
      });
    },
  });

  React.useEffect(() => {
    if (!open || !current) return;
    setName(current.name ?? "");
    setDynamicId((current.dynamic_id ?? "") as string);
    setPriceIronOnly(
      current.price_iron_only === null || current.price_iron_only === undefined
        ? ""
        : String(current.price_iron_only),
    );
    setPriceDryClean(
      current.price_dry_clean === null || current.price_dry_clean === undefined
        ? ""
        : String(current.price_dry_clean),
    );
    setIconFile(undefined);
    setIconPreview(current.icon ? String(current.icon) : "");
    setActiveStep(1);
  }, [open, current]);

  React.useEffect(() => {
    if (!iconFile) return;
    const url = URL.createObjectURL(iconFile);
    setIconPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [iconFile]);

  const stepIcons = useMemo(
    () => [
      <Info className="size-4" />,
      <DollarSign className="size-4" />,
      <ImageIcon className="size-4" />,
      <ClipboardList className="size-4" />,
    ],
    [],
  );

  const steps = [
    { title: t("items.editDialog.step.info", { defaultValue: "Item Information" }) },
    { title: t("items.editDialog.step.price", { defaultValue: "Price" }) },
    { title: t("items.editDialog.step.icon", { defaultValue: "Icon" }) },
    { title: t("items.editDialog.step.confirmation", { defaultValue: "Confirmation" }) },
  ];

  const canProceedInfo = name.trim().length > 0;
  const isSubmitting = updateMultipart.isPending;

  const handleUpdateItem = async () => {
    if (!current) return;
    const id = current.id;
    const priceIron = priceIronOnly.trim().length > 0 ? Number(priceIronOnly) : undefined;
    const priceDry = priceDryClean.trim().length > 0 ? Number(priceDryClean) : undefined;
    try {
      const fd = new FormData();
      if (name.trim().length > 0) fd.append("name", name);
      if (dynamicId.trim().length > 0) fd.append("dynamic_id", dynamicId.trim());
      if (priceIron !== undefined) fd.append("price_iron_only", String(priceIron));
      if (priceDry !== undefined) fd.append("price_dry_clean", String(priceDry));
      if (iconFile) fd.append("icon", iconFile);
      fd.append("_method", "PUT");
      await updateMultipart.mutateAsync({ item: id, data: fd as any });
      toast.success(
        t("items.editDialog.success", { defaultValue: "Item has been updated successfully" }),
      );
      try {
        queryClient.invalidateQueries({ queryKey: getItemsItemsListQueryKey() as any });
      } catch {}
      onClose();
    } catch (e: any) {
      const rawMessage = e?.response?.data?.message || e?.message;
      const translated =
        rawMessage || t("items.editDialog.error", { defaultValue: "Failed to update item" });
      toast.error(translated);
    }
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <ResponsiveDialog.Content className="max-w-2xl">
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>
            {t("items.editDialog.title", { defaultValue: "Edit Item" })}
          </ResponsiveDialog.Title>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          <Stepper
            value={activeStep}
            onValueChange={setActiveStep}
            indicators={{
              completed: <Check className="size-4" />,
              loading: <LoaderCircleIcon className="size-4 animate-spin" />,
            }}
            className="space-y-8"
          >
            <StepperNav>
              {steps.map((step, index) => (
                <StepperItem key={index} step={index + 1} className="relative flex-1 items-start">
                  <StepperTrigger className="flex flex-col gap-2.5">
                    <StepperIndicator>{stepIcons[index]}</StepperIndicator>
                    <StepperTitle>{step.title}</StepperTitle>
                  </StepperTrigger>
                  {steps.length > index + 1 && (
                    <StepperSeparator className="group-data-[state=completed]/step:bg-primary absolute inset-x-0 top-3 right-[calc(50%+0.875rem)] m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
                  )}
                </StepperItem>
              ))}
            </StepperNav>

            <StepperPanel className="text-sm">
              <StepperContent value={1}>
                <EditInfoStep
                  name={name}
                  dynamicId={dynamicId}
                  setName={setName}
                  setDynamicId={setDynamicId}
                  canProceedInfo={canProceedInfo}
                />
              </StepperContent>

              <StepperContent value={2}>
                <EditPriceStep
                  priceIronOnly={priceIronOnly}
                  setPriceIronOnly={setPriceIronOnly}
                  priceDryClean={priceDryClean}
                  setPriceDryClean={setPriceDryClean}
                />
              </StepperContent>

              <StepperContent value={3}>
                <EditIconStep iconPreview={iconPreview} setIconFile={setIconFile} />
              </StepperContent>

              <StepperContent value={4}>
                <EditConfirmationStep
                  name={name}
                  dynamicId={dynamicId}
                  priceIronOnly={priceIronOnly}
                  priceDryClean={priceDryClean}
                  iconPreview={iconPreview}
                />
              </StepperContent>
            </StepperPanel>
          </Stepper>
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer>
          <StepperFooterControls
            activeStep={activeStep}
            totalSteps={4}
            setActiveStep={setActiveStep}
            canProceed={canProceedInfo}
            isSubmitting={isSubmitting}
            onSubmit={handleUpdateItem}
            t={t}
            labels={{
              submit: t("items.editDialog.confirmation.update", { defaultValue: "Update Item" }),
            }}
          />
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}
