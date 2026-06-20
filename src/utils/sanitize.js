/**
 * Escapes HTML special characters to prevent XSS when inserting
 * user-generated content via innerHTML.
 * @param {string} text - Raw text that may contain HTML special chars
 * @returns {string} HTML-escaped safe string
 */
export function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
