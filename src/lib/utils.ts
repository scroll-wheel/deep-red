import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hour = date.getUTCHours().toString().padStart(2, "0");
  const minute = date.getUTCMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

export function webArchive(url: URL, date?: Date): string {
  let time = "";
  if (!date) {
    time += "*";
  } else {
    time += date.getUTCFullYear();
    time += date.getUTCMonth().toString().padStart(2, "0");
    time += date.getUTCDate().toString().padStart(2, "0");
    time += date.getUTCHours().toString().padStart(2, "0");
    time += date.getUTCMinutes().toString().padStart(2, "0");
    time += date.getUTCSeconds().toString().padStart(2, "0");
  }
  return `https://web.archive.org/web/${time}/${url.toString()}`;
}
