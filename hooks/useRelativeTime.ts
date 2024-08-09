import { useEffect, useState } from "react";

const units = {
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  year: 24 * 60 * 60 * 1000 * 365,
} as const;

export function useRelativeTime(date: Date) {
  const [relativeTime, setRelativeTime] = useState<string>();

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(date));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [date]);

  return relativeTime;
}

const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 0) {
    return "in the future";
  }
  if (diff < units.second) {
    return "just now";
  }
  if (diff < units.minute) {
    return `${Math.floor(diff / units.second)} seconds ago`;
  }
  if (diff < units.hour) {
    return `${Math.floor(diff / units.minute)} minutes ago`;
  }
  if (diff < units.day) {
    return `${Math.floor(diff / units.hour)} hours ago`;
  }
  if (diff < units.month) {
    return `${Math.floor(diff / units.day)} days ago`;
  }
  if (diff < units.year) {
    return `${Math.floor(diff / units.month)} months ago`;
  }

  return "in the past";
};
