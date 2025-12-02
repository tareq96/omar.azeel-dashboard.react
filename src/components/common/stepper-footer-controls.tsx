import { LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export type StepperFooterControlsProps = {
  activeStep: number;
  totalSteps: number;
  setActiveStep: (step: number) => void;
  canProceed: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  t: (key: string, options?: any) => string;
  labels?: {
    back?: string;
    next?: string;
    submit?: string;
    submitting?: string;
  };
};

export function StepperFooterControls({
  activeStep,
  totalSteps,
  setActiveStep,
  canProceed,
  isSubmitting,
  onSubmit,
  t,
  labels,
}: StepperFooterControlsProps) {
  const isFirstStep = activeStep === 1;
  const isLastStep = activeStep === totalSteps;

  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex">
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveStep(activeStep - 1)}
            disabled={isSubmitting}
          >
            {labels?.back || t("common.back", { defaultValue: "Back" })}
          </Button>
        )}
      </div>
      <div className="flex-1" />
      <div className="flex">
        {!isLastStep && (
          <Button
            type="button"
            onClick={() => setActiveStep(activeStep + 1)}
            disabled={!canProceed}
          >
            {labels?.next || t("common.next", { defaultValue: "Next" })}
          </Button>
        )}
        {isLastStep && (
          <Button type="button" onClick={onSubmit} disabled={!canProceed || isSubmitting}>
            {isSubmitting ? (
              <>
                <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
                {labels?.submitting || t("common.saving", { defaultValue: "Saving..." })}
              </>
            ) : (
              labels?.submit || t("common.create", { defaultValue: "Create" })
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
