export const badRequest = (statusCode, message) => {
  return {
    error: true,
    statusCode: 400 || statusCode,
    message: message || "Tài nguyên không hợp lệ",
  };
};
