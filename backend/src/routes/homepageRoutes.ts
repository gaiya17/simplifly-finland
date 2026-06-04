import { Router } from "express";
import { HomepageController } from "../controllers/homepageController";

const router = Router();

// Public endpoint to get fully populated homepage data
router.get("/data", HomepageController.getHomepageData);

export default router;
