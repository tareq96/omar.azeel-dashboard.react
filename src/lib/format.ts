import i18next from "i18next";

export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return "";
  let dateObj: Date;
  if (typeof date === "string") {
    dateObj = new Date(Date.parse(date));
  } else {
    dateObj = new Date(date);
  }

  try {
    return Intl.DateTimeFormat(i18next.language || "en-US", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(dateObj);
  } catch {
    return "";
  }
}

export function formatNumber(
  n: number,
  opts: Intl.NumberFormatOptions = { maximumFractionDigits: 2 },
): string {
  try {
    return new Intl.NumberFormat(i18next.language || "en-US", opts).format(n);
  } catch {
    return String(n);
  }
}

export function formatValue(val: unknown): string {
  if (val == null) return "—";
  if (typeof val === "number") return formatNumber(val);
  if (typeof val === "string") {
    const num = Number(val);
    return Number.isFinite(num) ? formatNumber(num) : val;
  }
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

export function translateUserRole(raw: unknown): string {
  const normalized = String(raw ?? "").trim();
  if (!normalized) return "";
  const lower = normalized.toLowerCase().replace(/\s|_|-/g, "");
  if (lower === "driver") {
    return i18next.t("tripsTable.columns.driver.label", { defaultValue: "Driver" }) || "Driver";
  }
  if (lower === "customer") {
    return (
      i18next.t("topupsTable.columns.customer.label", { defaultValue: "Customer" }) || "Customer"
    );
  }
  if (lower === "staff") {
    return i18next.t("topupsTable.columns.staff.label", { defaultValue: "Staff" }) || "Staff";
  }
  if (lower === "admin" || lower === "adminuser" || lower === "adminusers") {
    return i18next.language?.startsWith("ar") ? "مشرف" : "Admin";
  }
  return normalized;
}
