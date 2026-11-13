import mongoose from "mongoose";

const rentalPlanSchema = new mongoose.Schema(
  {
    tenureMonths: {
      type: Number,
      required: true,
      min: 1,
    },
    monthlyRent: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
      maxlength: 3000,
      trim: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    images: {
      type: [String],
      default: [],
      validate: {
        validator: (images) => images.length <= 10,
        message: "Maximum 10 product images are allowed",
      },
    },

    monthlyRent: {
      type: Number,
      required: true,
      min: 0,
    },

    securityDeposit: {
      type: Number,
      default: 0,
      min: 0,
    },

    rentalPlans: {
      type: [rentalPlanSchema],
      default: [],
      validate: {
        validator(plans) {
          const tenures = plans.map((plan) => plan.tenureMonths);

          return tenures.length === new Set(tenures).size;
        },
        message: "Duplicate rental tenure is not allowed",
      },
    },

    totalQuantity: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Total quantity must be an integer",
      },
    },

    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Available quantity must be an integer",
      },
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

// Validate inventory relationship
productSchema.pre("validate", function () {
  if (this.availableQuantity > this.totalQuantity) {
    this.invalidate(
      "availableQuantity",
      "Available quantity cannot exceed total quantity",
    );
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
