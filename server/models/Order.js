import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tenureMonths: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    monthlyRent: {
      type: Number,
      required: true,
    },

    securityDeposit: {
      type: Number,
      required: true,
    },

    rentalTotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    deliveryAddress: {
      type: addressSchema,
      required: true,
    },

    deliveryDate: {
      type: Date,
      required: true,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
    },

    rentSubtotal: {
      type: Number,
      required: true,
    },

    depositTotal: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["placed", "confirmed", "cancelled", "completed"],
      default: "placed",
    },

    paymentStatus: {
      type: String,
      enum: ["mock_paid", "pending"],
      default: "mock_paid",
    },

    paymentMode: {
      type: String,
      default: "mock",
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("order", orderSchema);

export default Order;
