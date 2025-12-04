import mongoose, { Schema } from "mongoose";
import { IUser, UserRole } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    signInMethod: {
      type: String,
      enum: ["password", "google"],
      required: true,
    },

    googleToken: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    passwordResetOtp: {
      otpCode: {
        type: Number,
        default: null,
      },
      otpExpireTime: {
        type: String,
        default: null,
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    // ====== BUSINESS FIELDS ======
    strength: {
      type: String,
      default: "",
    },
    improvement: {
      type: String,
      default: "",
    },
    pattern: {
      type: String,
      default: "",
    },

    // ====== SETTINGS ======
    emailNotification: {
      type: Boolean,
      default: true,
    },
    meetingReminder: {
      type: Boolean,
      default: true,
    },
    aiInsight: {
      type: Boolean,
      default: true,
    },

    salesMethodology: {
      type: String,
      enum: [
        "bant",
        "meddic",
        "meddpicc",
        "spin",
        "solutionSelling",
        "valueSelling",
        "challengerSales",
      ],
      default: "bant",
    },

    difficultyLevel: {
      type: String,
      enum: ["hard", "intermediate", "easy"],
      default: "intermediate",
    },
  },
  {
    timestamps: true,
  }
);

// =======================
// HASH PASSWORD BEFORE SAVE
// =======================
userSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (!user.isModified("password")) {
    return next();
  }

  const saltRounds = Number(config.bcrypt_salt_rounds) || 10;
  user.password = await bcrypt.hash(user.password, saltRounds);

  next();
});

// =========================
// HASH PASSWORD IN UPDATES
// =========================
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<IUser>;
  if (update && update.password) {
    const saltRounds = Number(config.bcrypt_salt_rounds) || 10;
    update.password = await bcrypt.hash(update.password, saltRounds);
    this.setUpdate(update);
  }
  next();
});

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
