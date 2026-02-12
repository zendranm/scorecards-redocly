import dayjs from "dayjs";
import { TimeWindow } from "@/types/scorecard";

export const calculateTimeWindow = (
  timeWindow: TimeWindow
): { start: Date; end: Date } => {
  const end = new Date();

  if (timeWindow.type === "rolling") {
    const start = dayjs().subtract(timeWindow.duration, "day").toDate();
    return { start, end };
  }

  const start = dayjs().startOf("day").toDate();
  return { start, end };
};

export const isWithinTimeWindow = (
  timestamp: string | Date,
  start: Date,
  end: Date
): boolean => {
  const date = dayjs(timestamp);
  return date.isAfter(dayjs(start)) && date.isBefore(dayjs(end));
};
