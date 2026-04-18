import Order from '../models/Order.js';

const VALID_STATUSES = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

// POST /api/orders — Create a new order
export const createOrder = async (req, res, next) => {
  try {
    const { customerName, phone, garments } = req.body;

    if (!customerName || !phone || !garments || garments.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'customerName, phone, and at least one garment are required',
      });
    }

    const order = new Order({ customerName, phone, garments });
    await order.save();

    res.status(201).json({
      success: true,
      data: {
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        estimatedDelivery: order.estimatedDelivery,
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders — Get all orders with optional filters
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, search, garment } = req.query;
    const filter = {};

    // Filter by status
    if (status) {
      filter.status = status.toUpperCase();
    }

    // Search by customerName or phone (case-insensitive)
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter orders that contain a specific garment type
    if (garment) {
      filter['garments.type'] = { $regex: `^${garment}$`, $options: 'i' };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id — Get single order by orderId
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID '${req.params.id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/status — Update order status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status field is required in request body',
      });
    }

    const upperStatus = status.toUpperCase();

    if (!VALID_STATUSES.includes(upperStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status '${status}'. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status: upperStatus },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID '${req.params.id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
