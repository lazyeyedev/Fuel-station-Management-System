import { Request, Response } from "express";

import {
  getAttendants,
  createAttendant,
  deactivateAttendant,
} from "../services/attendantService";

export async function listAttendants(req: Request, res: Response) {
  try {
    const stationId = Number(req.query.stationId);

    if (!Number.isInteger(stationId)) {
      return res.status(400).json({
        success: false,
        message: "stationId is required",
      });
    }

    const attendants = await getAttendants(stationId);

    res.json({
      success: true,
      data: attendants,
    });
  } catch (error) {
    console.error("Error fetching attendants:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch attendants",
    });
  }
}

export async function createNewAttendant(req: Request, res: Response) {
  try {
    const { stationId, fullName, phone, employeeNumber } = req.body;

    if (!stationId || !fullName || !String(fullName).trim()) {
      return res.status(400).json({
        success: false,
        message: "Station and full name are required",
      });
    }

    const attendant = await createAttendant({
      stationId: Number(stationId),
      fullName: String(fullName).trim(),
      phone: phone || null,
      employeeNumber: employeeNumber || null,
    });

    res.status(201).json({
      success: true,
      message: "Attendant created successfully",
      data: attendant,
    });
  } catch (error) {
    console.error("Error creating attendant:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create attendant",
    });
  }
}

export async function deactivateExistingAttendant(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendant ID",
      });
    }

    await deactivateAttendant(id);

    res.json({
      success: true,
      message: "Attendant deactivated successfully",
    });
  } catch (error) {
    console.error("Error deactivating attendant:", error);

    res.status(500).json({
      success: false,
      message: "Failed to deactivate attendant",
    });
  }
}
