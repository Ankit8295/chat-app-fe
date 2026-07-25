/**
 * Extracts the initials from a full name or email address (up to 2 characters).
 * @param name - The full name or string to extract initials from
 */
export function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
