import express from "express"
import { getUserDashboardOverview } from "../controller/AnalyticsController.js"
import { protect } from "../middleware/AuthMiddleware.js"

export const AnalyticsRouter = express.Router()

AnalyticsRouter.get('/overview',protect,getUserDashboardOverview)