import express from "express";

import { getMakeupBag } from "../controllers/MakeupBagController";

const router = express.Router();
router.get("/", getMakeupBag);

export default router;
