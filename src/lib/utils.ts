import { clsx, type ClassValue } from "clsx";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useIsAr(): boolean {
  const { i18n } = useTranslation();
  return i18n.language === "ar";
}

export function parseDateRange(dateString: string | undefined) {
  if (!dateString)
    return {
      from: undefined as string | undefined,
      to: undefined as string | undefined,
      fromMs: undefined as number | undefined,
      toMs: undefined as number | undefined,
    };

  const parts = dateString.split(",");
  const fromMs = parts[0] ? Number(parts[0]) : undefined;
  const toMs = parts[1] ? Number(parts[1]) : undefined;

  return {
    from: fromMs ? dayjs(fromMs).format("YYYY-MM-DD") : undefined,
    to: toMs ? dayjs(toMs).format("YYYY-MM-DD") : undefined,
    fromMs,
    toMs,
  };
}

export function getInitialDateRange(): string {
  const startOfMonth = dayjs().startOf("month");
  const today = dayjs();
  return [startOfMonth.valueOf(), today.valueOf()].join(",");
}

export function extractApiErrorMessage(error: any, t: any): string | null {
  if (!error) return null;

  // Helper: map server message through `api` namespace if available
  const mapMessage = (msg: unknown): string => {
    const raw = String(msg ?? "");
    if (!raw) return "";
    // Try translating via api-validations. Fallback to the raw string.
    const translated = t(raw, { ns: "api", defaultValue: raw });
    return translated || raw;
  };

  if (Array.isArray(error?.message)) {
    const mapped = error.message.map(mapMessage).filter(Boolean).join(" ");
    return mapped || t("api.unknownError");
  }

  const base = error?.error?.message ?? error?.message;
  const mapped = mapMessage(base);
  return mapped || t("api.unknownError");
}
