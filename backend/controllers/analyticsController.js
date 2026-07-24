const Visitor = require('../models/Visitor');
const Portfolio = require('../models/Portfolio');
const Message = require('../models/Message');

// @desc Record a visitor log
// @route POST /api/analytics/log
const logVisitor = async (req, res) => {
  try {
    const { path, referrer, portfolioId } = req.body;
    const userAgent = req.headers['user-agent'] || '';

    const visitor = new Visitor({
      path: path || '/',
      referrer: referrer || 'Direct',
      userAgent,
      portfolioId: portfolioId || null,
    });

    await visitor.save();

    // If portfolioId is provided, increment portfolio view count as well
    if (portfolioId) {
      await Portfolio.findByIdAndUpdate(portfolioId, { $inc: { views: 1 } });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get analytics summary data for Admin Dashboard (Recharts charts)
// @route GET /api/analytics/dashboard
const getDashboardAnalytics = async (req, res) => {
  try {
    const totalPortfolios = await Portfolio.countDocuments();
    const totalVisitors = await Visitor.countDocuments();
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ isRead: false });

    // Most popular portfolios by view count
    const popularPortfolios = await Portfolio.find()
      .sort({ views: -1 })
      .limit(5)
      .select('title category views thumbnail');

    // Visitor trends for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const visitorLogs = await Visitor.find({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Group logs by date (YYYY-MM-DD)
    const dailyViewsMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
      dailyViewsMap[dateStr] = { date: dateStr, label, views: 0 };
    }

    visitorLogs.forEach((log) => {
      const dateStr = log.createdAt.toISOString().split('T')[0];
      if (dailyViewsMap[dateStr]) {
        dailyViewsMap[dateStr].views += 1;
      }
    });

    const visitorChartData = Object.values(dailyViewsMap);

    // Traffic sources breakdown
    const referrers = await Visitor.aggregate([
      {
        $group: {
          _id: { $ifNull: ['$referrer', 'Direct'] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const trafficSources = referrers.map((ref) => ({
      name: ref._id || 'Direct',
      value: ref.count,
    }));

    res.json({
      totals: {
        portfolios: totalPortfolios,
        visitors: totalVisitors,
        messages: totalMessages,
        unreadMessages,
      },
      visitorChartData,
      popularPortfolios,
      trafficSources: trafficSources.length > 0 ? trafficSources : [{ name: 'Direct', value: totalVisitors || 1 }],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  logVisitor,
  getDashboardAnalytics,
};
