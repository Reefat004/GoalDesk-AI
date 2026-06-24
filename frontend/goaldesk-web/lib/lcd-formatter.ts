// Utility to format text for a 16x2 LCD Display
// SECURITY ASSERTION: Must guarantee that returned lines never exceed 16 characters to prevent IoT buffer overflows.

export type LcdMessage = {
  line1: string;
  line2: string;
};

function truncateTo16(text: string): string {
  if (text.length <= 16) return text;
  
  // Try to find a space near the end to break cleanly
  const substr = text.substring(0, 16);
  const lastSpace = substr.lastIndexOf(" ");
  
  if (lastSpace > 10) { // If there's a space in a reasonable place
    return substr.substring(0, lastSpace).trim();
  }
  
  // Otherwise just hard truncate
  return substr.trim();
}

export function formatLcdMessage(type: string, payload: any): LcdMessage {
  let line1 = "";
  let line2 = "";

  switch (type) {
    case "task":
      line1 = "Next Task:";
      line2 = payload.title || "";
      break;
    case "focus":
      line1 = `Focus: ${payload.minutes} min`;
      line2 = payload.title || "";
      break;
    case "reminder":
      line1 = "Reminder:";
      line2 = payload.title || "";
      break;
    case "motivation":
      line1 = "Tiny Step:";
      line2 = payload.title || "";
      break;
    case "complete":
      line1 = "Great job!";
      line2 = "Task complete";
      break;
    case "test":
      line1 = "Test Message";
      line2 = payload.message || "Hello GoalDesk";
      break;
    default:
      line1 = "GoalDesk AI";
      line2 = "Ready";
      break;
  }

  return {
    line1: truncateTo16(line1).padEnd(16, " "), // padEnd ensures consistent clearing on LCD
    line2: truncateTo16(line2).padEnd(16, " "),
  };
}
