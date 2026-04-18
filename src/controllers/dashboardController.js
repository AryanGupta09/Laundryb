import Order from '../models/Order.js';

const ALL_STATUSES = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

// GET /api/dashboard — Aggregated stats
export const getDashboard = async (req, res, next) => {
  try {
    // Start and end of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Run all queries in parallel for performance
    const [totalOrders, revenueAgg, statusAgg, todayAgg] = await Promise.all([
      // 1. Total order count
      Order.countDocuments(),

      // 2. Total revenue across all orders
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),

      // 3. Count of orders grouped by status
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // 4. Today's orders count and revenue
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfToday, $lte: endOfToday },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            revenue: { $sum: '$totalAmount' },
          },
        },
      ]),
    ]);

    // Build ordersByStatus — default all to 0
    const ordersByStatus = ALL_STATUSES.reduce((acc, s) => {
      acc[s] = 0;
      return acc;
    }, {});

    statusAgg.forEach(({ _id, count }) => {
      if (_id && ordersByStatus.hasOwnProperty(_id)) {
        ordersByStatus[_id] = count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: revenueAgg[0]?.total || 0,
        ordersByStatus,
        todaysOrders: todayAgg[0]?.count || 0,
        todaysRevenue: todayAgg[0]?.revenue || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
