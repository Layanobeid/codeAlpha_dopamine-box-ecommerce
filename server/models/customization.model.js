const mongoose = require("mongoose");

const customizationSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    text: {
      type: String,
    },
    color: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customization", customizationSchema); 
