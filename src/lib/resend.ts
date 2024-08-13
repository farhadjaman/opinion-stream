import { Resend } from "resend";
import VerificationEmailTemplate from "../components/verficationEmailTemplate";
import { ApiResponse } from "./types/ApiResponse";

export const resend = new Resend(process.env.RESEND_API);

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> => {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Hello world",
      react: VerificationEmailTemplate({ username, otp: verificationCode }),
    });
    return {
      success: true,
      message: "Successfully sent verification email",
    };
  } catch (emailError) {
    console.log("error sending verfication email", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
};
