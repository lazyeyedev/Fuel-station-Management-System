import { Router } from "express";

import {
  listAttendants,
  createNewAttendant,
  deactivateExistingAttendant,
} from "../controllers/attendantController";

const router = Router();

router.get("/", listAttendants);

router.post("/", createNewAttendant);

router.patch("/:id/deactivate", deactivateExistingAttendant);

export default router;
