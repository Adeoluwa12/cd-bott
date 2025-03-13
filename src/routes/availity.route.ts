import express from "express"
import { loginToAvaility, closeBrowser } from "../services/bot"
import { BackupCode } from "../models/backup=code"

export const availityRouter = express.Router()

// Login to Availity
availityRouter.post("/login", async (req, res) => {
  try {
    const success = await loginToAvaility()

    if (success) {
      res.status(200).json({ message: "Login successful" })
    } else {
      res.status(401).json({ message: "Login failed" })
    }
  } catch (error) {
    console.error("Error during login:", error)
    res.status(500).json({ message: "Internal server error", error: (error as Error).message })
  }
})

// // Manually check for new referrals
// availityRouter.post("/check-referrals", async (req, res) => {
//   try {
//     await checkForNewReferrals()
//     res.status(200).json({ message: "Referral check completed" })
//   } catch (error) {
//     console.error("Error checking referrals:", error)
//     res.status(500).json({ message: "Internal server error", error: (error as Error).message })
//   }
// })

// Add backup codes
availityRouter.post("/backup-codes", async (req, res):Promise<any> => {
  try {
    const { codes } = req.body

    if (!Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({ message: "Invalid backup codes" })
    }

    const savedCodes = []

    for (const code of codes) {
      // Check if code already exists
      const existingCode = await BackupCode.findOne({ code })

      if (!existingCode) {
        const newCode = await BackupCode.create({ code, isUsed: false })
        savedCodes.push(newCode)
      }
    }

    res.status(201).json({
      message: "Backup codes saved successfully",
      count: savedCodes.length,
    })
  } catch (error) {
    console.error("Error saving backup codes:", error)
    res.status(500).json({ message: "Internal server error", error: (error as Error).message })
  }
})

// Get backup codes status
availityRouter.get("/backup-codes", async (req, res) => {
  try {
    const unusedCodes = await BackupCode.find({ isUsed: false }).sort({ createdAt: -1 })
    const usedCodes = await BackupCode.find({ isUsed: true }).sort({ createdAt: -1 }).limit(10)

    res.status(200).json({
      unusedCount: unusedCodes.length,
      unusedCodes,
      recentlyUsedCodes: usedCodes,
    })
  } catch (error) {
    console.error("Error fetching backup codes:", error)
    res.status(500).json({ message: "Internal server error", error: (error as Error).message })
  }
})

// Reset browser session
availityRouter.post("/reset", async (req, res) => {
  try {
    await closeBrowser()
    res.status(200).json({ message: "Browser session reset successfully" })
  } catch (error) {
    console.error("Error resetting browser session:", error)
    res.status(500).json({ message: "Internal server error", error: (error as Error).message })
  }
})

