/**
 * @param {number} price
 * @param {string | undefined} [currency]
 */
export const formatCurrency = (price, currency) => {
  return currency
    ? Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 5,
      }).format(price)
    : Intl.NumberFormat().format(price);
};

/**
 * @param {number} date
 * @param {boolean} [noTime=false]
 */
export const formatDate = (date, noTime = false) => {
  return noTime
    ? Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
      }).format(date)
    : Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "medium",
      }).format(date);
};

/**
 * @param {number} date
 * @param {number} [ahead=1]
 */
export const getTomorrow = (date, ahead = 1) => {
  const today = new Date(date);

  return today.setDate(today.getDate() + ahead);
};

/**
 * @param {number} date
 * @param {'plus' | 'minus'} op
 * @param {number} [diff=1]
 */
export const getHoursBy = (date, op, diff = 1) => {
  const today = new Date(date);

  let hours = today.getHours();
  hours = op === "minus" ? hours - diff : hours + diff;

  return today.setHours(hours);
};

/**
 * @param {string} user_id
 * @param {string} origin
 */
export const getRefLink = (user_id, origin) => {
  return `${origin}/signin?ref=${user_id}`;
};

/**
 * @param {string} data
 */
export const copyText = async (data) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(data);

    return true;
  }

  return false;
};

/**
 * @param {string} id
 */
export const getEarnDesc = (id) => {
  switch (id) {
    case "affiliate":
      return `Earnings from your affiliate activities.`;

    case "referral":
      return `Earnings from your referrals' earnings.`;

    case "shop":
      return `Earnings from sales activities.`;

    default:
      return `All the earnings put together`;
  }
};
