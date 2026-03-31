import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    plan: {
      type: String,
      required: [true, "Membership plan is required"],
      enum: {
        values: ["monthly", "quarterly", "half-yearly", "yearly"],
        message: "{VALUE} is not a valid plan",
      },
    },
    feeAmount: {
      type: Number,
      required: [true, "Fee amount is required"],
      min: [0, "Fee amount cannot be negative"],
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    lastPaymentDate: {
      type: Date,
      required: [true, "Last payment date is required"],
    },
    nextDueDate: {
      type: Date,
      required: [true, "Next due date is required"],
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
memberSchema.index({ phone: 1 });
memberSchema.index({ nextDueDate: 1 });
memberSchema.index({ name: "text", phone: "text" });

// Virtual field to check if membership is overdue
memberSchema.virtual("isOverdue").get(function () {
  return this.nextDueDate < new Date();
});

// Virtual field to check if due soon (within 7 days)
memberSchema.virtual("isDueSoon").get(function () {
  const daysUntilDue = this.daysUntilDue();
  return daysUntilDue > 0 && daysUntilDue <= 7;
});

// Virtual field to get payment status
memberSchema.virtual("paymentStatus").get(function () {
  const today = new Date();
  if (this.nextDueDate < today) {
    return "overdue";
  } else if (this.daysUntilDue() <= 7) {
    return "due-soon";
  } else {
    return "paid";
  }
});

// Method to calculate days until due
memberSchema.methods.daysUntilDue = function () {
  const today = new Date();
  const dueDate = new Date(this.nextDueDate);
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Enable virtuals in JSON
memberSchema.set("toJSON", { virtuals: true });
memberSchema.set("toObject", { virtuals: true });

const Member = mongoose.model("Member", memberSchema);

export default Member;
