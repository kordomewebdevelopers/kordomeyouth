export const load = async ({ locals, cookies }) => {
  const { theme, authUser, user, pb } = locals;

  const cookieNotice = cookies.get("cookieNotice") || "";

  const native = { theme, cookieNotice };
  const { isAdmin } = pb.authStore;

  return { native, authUser, user, isAdmin };
};
