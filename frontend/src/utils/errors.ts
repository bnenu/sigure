export const parseError = (error: any) => {
  if (error.body && typeof error.body === "string") {
    try {
      const body = JSON.parse(error.body);

      return [error, body];
    } catch (e) {
      return [error, null];
    }
  }

  return [error, null];
};
