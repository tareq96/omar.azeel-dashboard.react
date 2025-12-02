import { exportToExcel } from "@/utils/exportToExcel";
import { useState } from "react";
import { toast } from "sonner";

interface UseExcelExportOptions {
  endpoint: string;
  params?: Record<string, unknown>;
  filenamePrefix?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Hook for Excel export functionality
 * Provides loading state and export function with built-in error handling
 */
export function useExcelExport({
  endpoint,
  params = {},
  filenamePrefix = "export",
  onSuccess,
  onError,
  successMessage,
  errorMessage,
}: UseExcelExportOptions) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (additionalParams?: Record<string, unknown>) => {
    setIsExporting(true);
    try {
      await exportToExcel(endpoint, { ...params, ...additionalParams }, filenamePrefix);

      toast.success(successMessage || "تم تصدير القائمة بنجاح");
      onSuccess?.();
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(errorMessage || "حدث خطأ أثناء تصدير القائمة");
      onError?.(error);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    handleExport,
  };
}
