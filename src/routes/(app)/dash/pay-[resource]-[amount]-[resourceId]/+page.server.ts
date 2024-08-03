import { formStringField } from "$helpers/form";
import { addAfterPay } from "$lib/server/transactions.js";
import { fail, redirect } from "@sveltejs/kit";

export const load = async ({ params, url }) => {
  const coupon = url.searchParams.get("coupon") || "";

  const pay = coupon === "demo" ? "0" : params.amount;

  return { options: { coupon, pay, ...params } };
};

export const actions = {
  complete: async ({ locals, request }) => {
    const { authUser } = locals;

    if (!authUser) {
      redirect(307, "/auth/signin");
    }

    const form = await request.formData();
    const transact_id = formStringField(form, "transact_id");
    const id = formStringField(form, "resourceId");
    const resource = formStringField(form, "resource");

    if (!transact_id) {
      return fail(400, { message: "Invalid transaction ID.", state: "error" });
    }

    const { state, message } = await addAfterPay(id, resource, transact_id);

    if (state === "error") {
      return fail(400, { message, state });
    }

    return { state: "completed", message };
  },
};
