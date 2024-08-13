import { sendVerificationEmail } from "@/src/lib/resend";
import UserModel from "@/src/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    const existingUserVerfiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerfiedByUsername) {
      return Response.json(
        { success: false, message: "Username already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const expirationDate = new Date();
    const verificationCode = Math.random().toString(36).substring(7);
    expirationDate.setHours(expirationDate.getHours() + 1);

    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "Email already exists" },
          { status: 400 }
        );
      } else {
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verificationCode = verificationCode;
        existingUserByEmail.verificationCodeExpires = expirationDate;
        await existingUserByEmail.save();
      }
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verificationCode,
        isVerified: false,
        verificationCodeExpires: expirationDate,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verificationCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("error registering user", error);
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
