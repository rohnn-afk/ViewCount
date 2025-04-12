import { EventModel } from "../models/EventModel.js";
import { ProjectModel } from "../models/ProjectModel.js";


export const getUserDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const range = req.query.range || "7";
    const days = parseInt(range);

    const projects = await ProjectModel.find({ user: userId }).select("_id");
    const projectIds = projects.map(p => p._id);

    if (projectIds.length === 0) {
      return res.json({
        totalViews: 0,
        uniqueVisitors: 0,
        topPage: null,
        bounceRate: "0%",
        charts: {
          views: [],
          visitors: [],
          topPages: [],
          bounceRates: []
        },
        recentEvents: [],
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total Views
    const totalViews = await EventModel.countDocuments({
      project: { $in: projectIds },
      timestamp: { $gte: startDate }
    });

    // Unique Visitors
    const uniqueVisitorsList = await EventModel.distinct("userAgent", {
      project: { $in: projectIds },
      timestamp: { $gte: startDate }
    });

    // Top Page
    const topPageAgg = await EventModel.aggregate([
      { $match: { project: { $in: projectIds }, timestamp: { $gte: startDate } } },
      { $group: { _id: "$url", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const topPage = topPageAgg[0]?._id || null;

    // Real Bounce Rate (overall)
    const sessionEvents = await EventModel.aggregate([
      {
        $match: {
          project: { $in: projectIds },
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            visitorId: "$metadata.visitorId",
            sessionDay: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
          },
          eventsCount: { $sum: 1 }
        }
      }
    ]);

    const totalSessions = sessionEvents.length;
    const bouncedSessions = sessionEvents.filter(session => session.eventsCount === 1).length;
    const bounceRate = totalSessions === 0 ? "0%" : `${((bouncedSessions / totalSessions) * 100).toFixed(1)}%`;

    // Bounce Rate Chart (grouped by day)
    const bounceRateChartMap = {};

    sessionEvents.forEach(session => {
      const day = session._id.sessionDay;
      if (!bounceRateChartMap[day]) {
        bounceRateChartMap[day] = { total: 0, bounced: 0 };
      }
      bounceRateChartMap[day].total += 1;
      if (session.eventsCount === 1) {
        bounceRateChartMap[day].bounced += 1;
      }
    });

    const bounceRatesChart = Object.entries(bounceRateChartMap).map(([date, stats]) => ({
      date,
      rate: parseFloat(((stats.bounced / stats.total) * 100).toFixed(1))
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Chart Data
    const [viewsChart, visitorsChart, topPagesChart] = await Promise.all([

      // Views Chart
      EventModel.aggregate([
        {
          $match: {
            project: { $in: projectIds },
            timestamp: { $gte: startDate },
          }
        },
        {
          $group: {
            _id: {
              day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
            },
            count: { $sum: 1 },
          }
        },
        { $sort: { "_id.day": 1 } },
        {
          $project: {
            _id: 0,
            date: "$_id.day",
            count: 1,
          }
        }
      ]),

      // Visitors Chart
      EventModel.aggregate([
        {
          $match: {
            project: { $in: projectIds },
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
              user: "$userAgent"
            }
          }
        },
        {
          $group: {
            _id: "$_id.day",
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1
          }
        }
      ]),

      // Top Pages Chart
      EventModel.aggregate([
        {
          $match: {
            project: { $in: projectIds },
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
              url: "$url"
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.day": 1, count: -1 }
        },
        {
          $group: {
            _id: "$_id.day",
            topPage: { $first: "$_id.url" },
            count: { $first: "$count" }
          }
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            topPage: 1,
            count: 1
          }
        }
      ])
    ]);

    // Recent Events
    const recentEvents = await EventModel.find({
      project: { $in: projectIds },
    })
      .sort({ timestamp: -1 })
      .limit(5)
      .select("eventType url timestamp");

    res.json({
      totalViews,
      uniqueVisitors: uniqueVisitorsList.length,
      topPage,
      bounceRate,
      charts: {
        views: viewsChart,
        visitors: visitorsChart,
        topPages: topPagesChart,
        bounceRates: bounceRatesChart
      },
      recentEvents
    });

  } catch (err) {
    console.error("Overview error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};


