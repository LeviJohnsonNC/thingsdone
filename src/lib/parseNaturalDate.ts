import * as chrono from "chrono-node";
import { format } from "date-fns";

interface ParsedDateResult {
  cleanTitle: string;
  scheduledDate?: string; // YYYY-MM-DD
  dateLabel?: string; // human-readable, e.g. "Tomorrow", "Mar 15"
}

export function parseNaturalDate(input: string): ParsedDateResult {
  const results = chrono.parse(input);
  if (results.length === 0) {
    return { cleanTitle: input };
  }

  const result = results[0];
  const date = result.start.date();
  const scheduledDate = format(date, "yyyy-MM-dd");

  // Remove the matched text from the title
  const cleanTitle = (
    input.slice(0, result.index) + input.slice(result.index + result.text.length)
  ).replace(/\s{2,}/g, " ").trim();

  // Friendly label
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let dateLabel: string;
  if (format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
    dateLabel = "Today";
  } else if (format(date, "yyyy-MM-dd") === format(tomorrow, "yyyy-MM-dd")) {
    dateLabel = "Tomorrow";
  } else {
    dateLabel = format(date, "EEE, MMM d");
  }

  return { cleanTitle: cleanTitle || input, scheduledDate, dateLabel };
}
