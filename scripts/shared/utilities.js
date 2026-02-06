/**
 * Shared Utility Functions
 * Common helper functions used across multiple modules
 */

/**
 * Extracts initials from a full name
 * @param {string} name - The full name (e.g., "Max Mustermann")
 * @param {string} fallback - Fallback value if name is empty (default: "MS")
 * @returns {string} The initials (e.g., "MM")
 *
 * @example
 * getInitials("Max Mustermann") // Returns "MM"
 * getInitials("John") // Returns "JO" (first 2 chars)
 * getInitials("") // Returns "MS" (fallback)
 * getInitials("", "AB") // Returns "AB" (custom fallback)
 */
function getInitials(name, fallback = "MS") {
  if (!name || !name.trim()) return fallback;

  const parts = name.trim().split(/\s+/);

  // Single name: take first 2 characters
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  // Multiple names: take first char of first and last name
  const firstInitial = parts[0][0];
  const lastInitial = parts[parts.length - 1][0];
  return (firstInitial + lastInitial).toUpperCase();
}
