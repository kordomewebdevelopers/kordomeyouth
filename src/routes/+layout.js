export const load = async ({ data }) => {
  const { native, user, authUser, isAdmin } = data;

  return { native, user, authUser, isAdmin };
};
