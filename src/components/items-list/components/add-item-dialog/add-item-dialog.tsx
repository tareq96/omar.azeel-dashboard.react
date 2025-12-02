import * as React from "react";
import { useState, useMemo } from "react";
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
import {
  Check,
  ImageIcon,
  Info,
  LoaderCircleIcon,
  DollarSign,
  ClipboardList,
  PlusIcon,
} from "lucide-react";
import { useItemsStore, getItemsItemsListQueryKey } from "@/services/api/generated/items/items";
import { useQueryClient } from "@tanstack/react-query";

import InfoStep from "./steps/info";
import PriceStep from "./steps/price";
import IconStep from "./steps/icon";
import ConfirmationStep from "./steps/confirmation";

type AddItemDialogProps = {
  onCreated?: () => void;
};

export default function AddItemDialog({ onCreated }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [dynamicId, setDynamicId] = useState("");
  const [priceIronOnly, setPriceIronOnly] = useState<string>("");
  const [priceDryClean, setPriceDryClean] = useState<string>("");
  const [iconFile, setIconFile] = useState<File | undefined>(undefined);
  const [iconPreview, setIconPreview] = useState<string>("");

  const itemsStoreJson = useItemsStore();
  const itemsStoreMultipart = useItemsStore({
    request: { headers: { "Content-Type": "multipart/form-data" } },
  });

  React.useEffect(() => {
    if (!open) {
      setName("");
      setDynamicId("");
      setPriceIronOnly("");
      setPriceDryClean("");
      setIconFile(undefined);
      setIconPreview("");
      setActiveStep(1);
    }
  }, [open]);

  React.useEffect(() => {
    if (!iconFile) {
      setIconPreview("");
      return;
    }
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

  const canProceedInfo = name.trim().length > 0;
  const hasAnyPrice = priceIronOnly.trim().length > 0 || priceDryClean.trim().length > 0;

  // Step validation - determines if user can proceed to each step
  const steps = [
    {
      title: t("items.addDialog.step.info", { defaultValue: "Item Information" }),
      disabled: false, // Step 1 is always accessible
    },
    {
      title: t("items.addDialog.step.price", { defaultValue: "Price" }),
      disabled: !canProceedInfo, // Requires step 1 to be valid
    },
    {
      title: t("items.addDialog.step.icon", { defaultValue: "Icon" }),
      disabled: !canProceedInfo || !hasAnyPrice, // Requires steps 1 and 2 to be valid
    },
    {
      title: t("items.addDialog.step.confirmation", { defaultValue: "Confirmation" }),
      disabled: !canProceedInfo || !hasAnyPrice, // Requires steps 1 and 2 to be valid (step 3 is optional)
    },
  ];

  const isSubmitting = itemsStoreJson.isPending || itemsStoreMultipart.isPending;

  const handleCreateItem = async () => {
    if (!canProceedInfo || !hasAnyPrice) return;
    const priceIron = priceIronOnly.trim().length > 0 ? Number(priceIronOnly) : undefined;
    const priceDry = priceDryClean.trim().length > 0 ? Number(priceDryClean) : undefined;
    try {
      if (iconFile) {
        const fd = new FormData();
        fd.append("name", name);
        if (dynamicId.trim().length > 0) fd.append("dynamic_id", dynamicId.trim());
        if (priceIron !== undefined) fd.append("price_iron_only", String(priceIron));
        if (priceDry !== undefined) fd.append("price_dry_clean", String(priceDry));
        fd.append("icon", iconFile);
        await itemsStoreMultipart.mutateAsync({ data: fd as any });
      } else {
        await itemsStoreJson.mutateAsync({
          data: {
            name,
            dynamic_id: dynamicId.trim().length > 0 ? dynamicId.trim() : undefined,
            price_iron_only: priceIron !== undefined ? priceIron : undefined,
            price_dry_clean: priceDry !== undefined ? priceDry : undefined,
          } as any,
        });
      }
      toast.success(
        t("items.addDialog.success", { defaultValue: "Item has been created successfully" }),
      );
      try {
        queryClient.invalidateQueries({ queryKey: getItemsItemsListQueryKey() as any });
      } catch {}
      setOpen(false);
      onCreated?.();
    } catch (e: any) {
      const rawMessage = e?.response?.data?.message || e?.message;
      const translated =
        rawMessage || t("items.addDialog.error", { defaultValue: "Failed to create item" });
      toast.error(translated);
    }
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={(o) => setOpen(o)}>
      <ResponsiveDialog.Trigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          {t("items.addDialog.trigger", { defaultValue: "Add Item" })}
        </Button>
      </ResponsiveDialog.Trigger>
      <ResponsiveDialog.Content className="max-w-2xl">
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>
            {t("items.addDialog.title", { defaultValue: "Add Item" })}
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
                <StepperItem
                  key={index}
                  step={index + 1}
                  disabled={step.disabled}
                  className="relative flex-1 items-start"
                >
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

            <StepperPanel className="px-2 text-sm">
              <StepperContent value={1}>
                <InfoStep
                  name={name}
                  dynamicId={dynamicId}
                  setName={setName}
                  setDynamicId={setDynamicId}
                  canProceedInfo={canProceedInfo}
                />
              </StepperContent>

              <StepperContent value={2}>
                <PriceStep
                  priceIronOnly={priceIronOnly}
                  setPriceIronOnly={setPriceIronOnly}
                  priceDryClean={priceDryClean}
                  setPriceDryClean={setPriceDryClean}
                  hasAnyPrice={hasAnyPrice}
                />
              </StepperContent>

              <StepperContent value={3}>
                <IconStep iconPreview={iconPreview} setIconFile={setIconFile} />
              </StepperContent>

              <StepperContent value={4}>
                <ConfirmationStep
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
            canProceed={activeStep === 1 ? canProceedInfo : canProceedInfo && hasAnyPrice}
            isSubmitting={isSubmitting}
            onSubmit={handleCreateItem}
            t={t}
            labels={{
              submit: t("items.addDialog.confirmation.create", { defaultValue: "Create Item" }),
            }}
          />
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}
