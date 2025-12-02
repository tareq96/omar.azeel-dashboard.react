import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";

type Status = "Pending" | "InProgress" | "Completed" | "";

interface TripFormData {
  driverId?: string;
  status: Status;
  startedDate?: Date;
  startedTime: string;
  endedDate?: Date;
  endedTime: string;
}

export function useTripForm(trip: any) {
  const [formData, setFormData] = useState<TripFormData>({
    driverId: undefined,
    status: "",
    startedDate: undefined,
    startedTime: "",
    endedDate: undefined,
    endedTime: "",
  });

  const normalizeStatus = useCallback((raw: any): Status => {
    const normalized = String(raw ?? "").trim();
    if (!normalized) return "";
    const lower = normalized.toLowerCase().replace(/\s|-/g, "");
    const map: Record<string, Exclude<Status, "">> = {
      pending: "Pending",
      inprogress: "InProgress",
      in_progress: "InProgress",
      completed: "Completed",
      complete: "Completed",
    };
    return map[lower] || (normalized as Status);
  }, []);

  useEffect(() => {
    setFormData({
      driverId: trip?.user_id ? String(trip.user_id) : undefined,
      status: normalizeStatus(trip?.status),
      startedDate: trip?.started_at ? dayjs(trip.started_at).toDate() : undefined,
      startedTime: trip?.started_at ? dayjs(trip.started_at).format("HH:mm:ss") : "",
      endedDate: trip?.ended_at ? dayjs(trip.ended_at).toDate() : undefined,
      endedTime: trip?.ended_at ? dayjs(trip.ended_at).format("HH:mm:ss") : "",
    });
  }, [trip?.user_id, trip?.status, trip?.started_at, trip?.ended_at, normalizeStatus]);

  const updateField = useCallback(
    <K extends keyof TripFormData>(field: K, value: TripFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const buildPayload = useCallback(() => {
    const payload: Record<string, any> = {};
    if (formData.driverId) payload.user_id = Number(formData.driverId);
    if (formData.status) payload.status = formData.status;
    if (formData.startedDate) {
      const date = dayjs(formData.startedDate).format("YYYY-MM-DD");
      const time = formData.startedTime || "00:00:00";
      payload.started_at = `${date} ${time}`;
    }
    if (formData.endedDate) {
      const date = dayjs(formData.endedDate).format("YYYY-MM-DD");
      const time = formData.endedTime || "00:00:00";
      payload.ended_at = `${date} ${time}`;
    }
    return payload;
  }, [formData]);

  return { formData, updateField, buildPayload };
}
