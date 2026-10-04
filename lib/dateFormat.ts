/**
 * Date formatting utilities for Baby Tracker
 * Enforces DD/MM/YYYY throughout the application
 */

/**
 * Format any date input (ISO string, timestamp, Date object) to DD/MM/YYYY
 */
export function formatDate(input?: string | number | Date | null): string {
  if (!input) return '';
  const d = typeof input === 'object' && input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format to DD/MM/YYYY HH:mm
 */
export function formatDateTime(input?: string | number | Date | null): string {
  if (!input) return '';
  const d = typeof input === 'object' && input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Format to DD/MM (for chart axes or badges)
 */
export function formatDateShort(input?: string | number | Date | null): string {
  if (!input) return '';
  const d = typeof input === 'object' && input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}

/**
 * Format date for input elements or ISO compatibility
 */
export function toISODate(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
