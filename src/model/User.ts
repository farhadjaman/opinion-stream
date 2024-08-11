import { Document, Model, Schema, model, models } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  isVerified: boolean;
  verifyCodeExpires: Date;
  isAcceptingMessages: boolean;
  messages: Message[];
}
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9. _-]+@[a-zA-Z0-9. -]+\. [a-zA-Z]{2,4}$/,
      "please use a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verification code is required"],
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  verifyCodeExpires: {
    type: Date,
    required: [true, "Verification code expiration date is required"],
  },
  isAcceptingMessages: {
    type: Boolean,
    required: true,
    default: true,
  },
  messages: [MessageSchema],
});

const UserModel =
  (models.User as Model<User>) || model<User>("User", UserSchema);

export default UserModel;
