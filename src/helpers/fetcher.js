/**
 * @param {string} path
 * @param {"POST" | "GET" | "PUT" | "DELETE" | "PATCH"} method
 * @param {Object} [body={}]
 */
export const fetcher = async (path, method, body) => {
  if (method === "GET" || body === undefined) {
    return await fetch(path, { method });
  }

  return await fetch(path, { method, body: JSON.stringify(body) });
};
