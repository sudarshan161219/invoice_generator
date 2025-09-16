import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Load .env (if not already loaded in your setup)
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
  try {
    const filePath = path.resolve(__dirname, "test.jpg"); // place a small test image in the same folder
    if (!fs.existsSync(filePath)) {
      console.error("❌ test.jpg not found. Please put one in the scripts folder.");
      process.exit(1);
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "test_uploads",
    });

    console.log("✅ Upload success!");
    console.log("Public ID:", result.public_id);
    console.log("Secure URL:", result.secure_url);
  } catch (err) {
    console.error("❌ Upload failed", err);
  }
}

testUpload();
