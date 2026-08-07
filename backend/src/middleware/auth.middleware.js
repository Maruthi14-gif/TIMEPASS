import { getAuth } from "@clerk/express";
import User from "../models/User.js";

export async function protectRoute(req, res, next) {
  try {
    const auth = getAuth(req);

    console.log("AUTH OBJECT:", auth);   // 👈 Add this line

    const { userId } = auth;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ message: "User profile is not synced yet" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}