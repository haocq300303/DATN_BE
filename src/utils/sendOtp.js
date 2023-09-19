import twilio from "twilio";

// Thay đổi thông tin Twilio của bạn tại đây
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

export const sendOtp = (otp, recipientPhoneNumber) => {
  const client = twilio(accountSid, authToken);

  const message = `Your OTP is: ${otp}`;

  client.messages
    .create({
      body: message,
      from: twilioPhoneNumber,
      to: recipientPhoneNumber,
    })
    .then((message) => console.log("OTP sent successfully."))
    .catch((err) => console.error("Error sending OTP:", err));
};
