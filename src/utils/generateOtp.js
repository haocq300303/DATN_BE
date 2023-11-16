import randomstring from "randomstring";

export const generateOtp = () => {
  const otpCode = randomstring.generate({ length: 6, charset: "numeric" });
  const otpExpiration = Date.now() + 2 * 60 * 1000;

  return {
    otpCode,
    otpExpiration,
  };
};
