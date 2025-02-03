import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const DATABASE_URL = process.env.DATABASE_URL;

async function Main() {
  await mongoose.connect(DATABASE_URL);
}

Main();

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  password: String,
  userName: String,
});

const User = mongoose.model("User", UserSchema);

const BankSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const Transactions = mongoose.model("Transactions", BankSchema);

export { User, Transactions };
