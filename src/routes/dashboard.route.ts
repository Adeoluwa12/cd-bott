import express from "express"
import { Referral } from "../models/referrals"
import { Notification } from "../models/notification"
import { BackupCode } from "../models/backup=code"

export const dashboardRouter = express.Router()

// Dashboard home page
dashboardRouter.get("/", async (req, res) => {
  try {
    // Get recent referrals
    const recentReferrals = await Referral.find().sort({ createdAt: -1 }).limit(10)

    // Get unread notifications
    const unreadNotifications = await Notification.find({ isRead: false }).sort({ createdAt: -1 })

    // Get backup codes status
    const unusedCodesCount = await BackupCode.countDocuments({ isUsed: false })

    res.render("dashboard", {
      recentReferrals,
      unreadNotifications,
      unusedCodesCount,
    })
  } catch (error) {
    console.error("Error rendering dashboard:", error)
    res.status(500).render("error", {
      message: "Failed to load dashboard",
      error: (error as Error).message,
    })
  }
})

// Get all referrals
dashboardRouter.get("/referrals", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    const referrals = await Referral.find().sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Referral.countDocuments()

    res.render("referrals", {
      referrals,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error) {
    console.error("Error fetching referrals:", error)
    res.status(500).render("error", {
      message: "Failed to load referrals",
      error: (error as Error).message,
    })
  }
})

// Get referral details
dashboardRouter.get("/referrals/:id", async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id)

    if (!referral) {
      return res.status(404).render("error", {
        message: "Referral not found",
        error: "The requested referral does not exist",
      })
    }

    res.render("referral-details", { referral })
  } catch (error) {
    console.error("Error fetching referral details:", error)
    res.status(500).render("error", {
      message: "Failed to load referral details",
      error: (error as Error).message,
    })
  }
})

// Get all notifications
dashboardRouter.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 })

    res.render("notifications", { notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    res.status(500).render("error", {
      message: "Failed to load notifications",
      error: (error as Error).message,
    })
  }
})

// Mark notification as read
dashboardRouter.post("/notifications/:id/read", async (req, res): Promise<any> => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }

    notification.isRead = true
    await notification.save()

    res.status(200).json({ message: "Notification marked as read" })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    res.status(500).json({
      message: "Failed to mark notification as read",
      error: (error as Error).message,
    })
  }
})

// Backup codes management
dashboardRouter.get("/backup-codes", async (req, res) => {
  try {
    const unusedCodes = await BackupCode.find({ isUsed: false }).sort({ createdAt: -1 })

    const usedCodes = await BackupCode.find({ isUsed: true }).sort({ createdAt: -1 }).limit(20)

    res.render("backup-codes", { unusedCodes, usedCodes })
  } catch (error) {
    console.error("Error fetching backup codes:", error)
    res.status(500).render("error", {
      message: "Failed to load backup codes",
      error: (error as Error).message,
    })
  }
})

