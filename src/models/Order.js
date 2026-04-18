import mongoose from 'mongoose';

// Hardcoded garment prices
const PRICES = {
  Shirt: 50,
  Pants: 60,
  Saree: 120,
  Jacket: 150,
  Kurta: 70,
  Suit: 250,
};

const garmentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.keys(PRICES),
      required: [true, 'Garment type is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    pricePerItem: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    garments: {
      type: [garmentSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one garment is required',
      },
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'],
      default: 'RECEIVED',
    },
    estimatedDelivery: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Pre-save hook: auto-calculate everything
orderSchema.pre('save', async function (next) {
  // 1. Calculate pricePerItem and subtotal for each garment
  this.garments = this.garments.map((g) => {
    const pricePerItem = PRICES[g.type] || 0;
    const subtotal = pricePerItem * g.quantity;
    return { type: g.type, quantity: g.quantity, pricePerItem, subtotal };
  });

  // 2. Calculate totalAmount
  this.totalAmount = this.garments.reduce((sum, g) => sum + g.subtotal, 0);

  // 3. Only on new document creation
  if (this.isNew) {
    // Auto-generate orderId based on count of existing docs
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `ORD-${String(count + 1).padStart(3, '0')}`;

    // Set estimatedDelivery = today + 3 days
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 3);
    this.estimatedDelivery = delivery;
  }

  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
