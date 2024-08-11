import mongoose from "mongoose";

type ConnectionOptions = {
  isConnect?: number;
};

const connection: ConnectionOptions = {};

export default async function dbConnect(): Promise<void> {
  if (connection.isConnect) {
    console.log("Already connected to the database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnect = db.connections[0].readyState;
    console.log("Database connected Successfully");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
    process.exit(1);
  }
}
