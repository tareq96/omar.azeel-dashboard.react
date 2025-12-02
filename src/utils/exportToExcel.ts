import { apiClient } from "@/services/api/base/api-client";
import dayjs from "dayjs";

/**
 * Downloads a blob as a file
 */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Export data to Excel by calling an API endpoint with export=true
 */
export const exportToExcel = async (
  endpoint: string,
  params: Record<string, unknown>,
  filenamePrefix: string = "export",
): Promise<void> => {
  const response = await apiClient.request({
    url: endpoint,
    method: "GET",
    headers: {
      accept: "text/csv",
      "Content-Type": "text/csv",
    },
    params: {
      ...params,
      export: true,
    },
    responseType: "text",
  });

  // The response.data should be a CSV string
  const csvData = response as unknown as string;

  // Validate CSV data
  if (csvData?.length === 0) {
    throw new Error("No data received from server");
  }

  // Include BOM for Excel to properly detect UTF-8 encoding
  const BOM = "\ufeff";
  const blob = new Blob([BOM, csvData], { type: "text/csv;charset=utf-8;" });

  // Generate filename with timestamp
  const filename = `${filenamePrefix}_${dayjs().format("YYYYMMDD")}.csv`;

  // Download the file
  downloadBlob(blob, filename);
};
