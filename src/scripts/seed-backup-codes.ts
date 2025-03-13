import mongoose from "mongoose"
import { BackupCode } from "../models/backup=code"
import { config } from "dotenv"

// Load environment variables
config()

const INITIAL_BACKUP_CODES = ["T39OKIDAL0", "CPJ5P2M6BJ"]

async function seedBackupCodes() {
  console.log("Starting database seeding for backup codes...")

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/availity-automation")
    console.log("Connected to MongoDB")

    // Check if backup codes already exist
    const existingCount = await BackupCode.countDocuments()

    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing backup codes. Skipping seeding.`)
    } else {
      console.log("No existing backup codes found. Adding initial codes...")

      // Create backup codes
      const backupCodes = INITIAL_BACKUP_CODES.map((code) => ({
        code,
        isUsed: false,
        createdAt: new Date(),
      }))

      await BackupCode.insertMany(backupCodes)
      console.log(`Successfully added ${backupCodes.length} initial backup codes`)
    }
  } catch (error) {
    console.error("Error seeding backup codes:", error)
  } finally {
    // Close the database connection
    await mongoose.connection.close()
    console.log("Database connection closed")
  }
}

// Run the seeding function
seedBackupCodes()

