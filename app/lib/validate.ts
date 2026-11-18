export function isValidMessageLength(text: string): boolean {
  return text.length <= 1000;
}

export function getRecentMessages<T>(messages: T[]): T[] {
  return messages.slice(-10);
}
