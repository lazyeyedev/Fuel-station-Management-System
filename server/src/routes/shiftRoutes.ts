import { Router } from "express";

import {
  listShifts,
  showShift,
  listShiftAssignments,
  shiftOptions,
  createNewShift,
} from "../controllers/shiftController";

const router = Router();

router.get("/", listShifts);

router.get(
  "/options/:stationId",
  shiftOptions
);

router.get(
  "/:id/assignments",
  listShiftAssignments
);

router.get("/:id", showShift);

router.post("/", createNewShift);

export default router;