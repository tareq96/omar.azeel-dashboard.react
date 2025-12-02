import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export interface ErrorDisplayProps {
  errorText: string | null;
}

export function ErrorDisplay({ errorText }: ErrorDisplayProps) {
  const { t } = useTranslation();
  if (!errorText) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t("dashboard.summary.errorTitle")}</CardTitle>
        <CardDescription className="text-red-600">{errorText}</CardDescription>
      </CardHeader>
    </Card>
  );
}
