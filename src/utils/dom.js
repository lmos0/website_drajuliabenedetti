/**
 * Sets the text content of the first element matching the selector.
 * @param {string} selector - CSS selector
 * @param {string} text - Text to set (safe, no HTML parsing)
 */
export function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

/**
 * Sets the inner HTML of the first element matching the selector.
 * Use only with trusted/static content. For user data, prefer setText.
 * @param {string} selector - CSS selector
 * @param {string} html - HTML string to inject
 */
export function setHtml(selector, html) {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = html;
}

/**
 * Sets an attribute on all elements matching the selector.
 * @param {string} selector - CSS selector
 * @param {string} attr - Attribute name
 * @param {string} value - Attribute value
 */
export function setAttr(selector, attr, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.setAttribute(attr, value);
  });
}
