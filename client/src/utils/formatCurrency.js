/**
 * Format a number as BDT currency
 * @param {number} amount
 * @returns {string} e.g. "৳1,850"
 */
export const formatCurrency = (amount) => {
  return `৳${Number(amount).toLocaleString('en-BD')}`;
};
