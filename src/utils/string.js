/**
 * Extracts up to two initials from a full name.
 * @param {string} name - Full name (e.g. "João Silva")
 * @returns {string} Uppercase initials (e.g. "JS")
 */
export function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
