/**
 * @typedef {import('$types/status').CashoutStatus} CashoutStatus
 */

/**
 * @param {string} status
 * @param {number} earn
 * @param {string} message
 */
export const getPromotionInfo = (status, earn, message) => {
  switch (status) {
    case "expired":
      return "Time up to submit a feedback and claim your earning.";

    case "submitted":
      return "Your promotion was submitted and is pending review and approval.";

    case "approved":
      return `Congratulations! You earn GHC ${earn} from this promotion. Click to add
      the amount to your wallet.
      `;

    case "rejected":
      return `Your promotion was rejected due to inaccurate feedback.
      If you think this was a mistake, kindly report to us,
      otherwise remove it.
      `;

    case "declined":
      return `Your promotion feedback, was not accepted by the advertiser.
      But We're further looking it.`;

    case "accepted":
      return "Feedback is accepted by the advertiser, but pending approval.";

    default:
      return message;
  }
};

/**
 * @param {string} status
 * @returns {string}
 */
export const getCampaignInfo = (status) => {
  switch (status) {
    case "running":
      return `Campaign is running. Regularly check to
       verify promotion feedbacks from affiliates.`;

    case "ended":
      return `This campaign has ended. You can safely remove it.`;

    case "pending":
      return "Campaign is pending approval. No action to perform yet.";

    case "paused":
      return "This campaign is paused. Click to wake.";

    case "approved":
      return `The campaign is approved.
      Take the button to make payment. Use promo code: demo`;

    case "rejected":
      return `This campaign was rejected because either
      it violates our content policy or does not meet our criteria.
      `;

    default:
      return "";
  }
};

/**
 * @param {string} status
 * @returns {string}
 */
export const getOrderInfo = (status) => {
  switch (status) {
    case "unmatched":
      return "The phone number and network are unmatched";

    case "pending":
      return "This order is received and awaiting to be processed.";

    case "queued":
      return "This order is processed and will take few minutes to be delivered.";

    case "success":
      return "This order was successfully delivered. You can now delete this order.";

    default:
      return "";
  }
};

/**
 * @param {CashoutStatus} status
 * @returns {string}
 */
export const cashoutInfo = (status) => {
  switch (status) {
    case "mismatched":
      return "Name/phone does not match";

    case "rejected":
      return "Invalid cashout request";

    case "queued":
      return "In queue. Awaiting processing";

    case "success":
      return "Successfully  cashout.";

    default:
      return "In queue. Awaiting processing";
  }
};
