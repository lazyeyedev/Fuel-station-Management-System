import { Request, Response } from "express";

import {
  getShifts,
  getShiftById,
  getShiftAssignments,
  getShiftOptions,
  createShift,
} from "../services/shiftService";

export async function listShifts(req: Request, res: Response) {
  try {
    const stationId = req.query.stationId
      ? Number(req.query.stationId)
      : undefined;

    const shifts = await getShifts(stationId);

    res.json({
      success: true,
      data: shifts,
    });
  } catch (error) {
    console.error("Error fetching shifts:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch shifts",
    });
  }
}

export async function showShift(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shift ID",
      });
    }

    const shift = await getShiftById(id);

    if (!Array.isArray(shift) || shift.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Shift not found",
      });
    }

    res.json({
      success: true,
      data: shift[0],
    });
  } catch (error) {
    console.error("Error fetching shift:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch shift",
    });
  }
}

export async function listShiftAssignments(
  req: Request,
  res: Response
) {
  try {
    const shiftId = Number(req.params.id);

    if (!Number.isInteger(shiftId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shift ID",
      });
    }

    const assignments = await getShiftAssignments(shiftId);

    res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error("Error fetching shift assignments:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch shift assignments",
    });
  }
}

export async function shiftOptions(req: Request, res: Response) {
  try {
    const stationId = Number(req.params.stationId);

    if (!Number.isInteger(stationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid station ID",
      });
    }

    const options = await getShiftOptions(stationId);

    res.json({
      success: true,
      data: options,
    });
  } catch (error) {
    console.error("Error fetching shift options:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch shift options",
    });
  }
}

export async function createNewShift(
  req: Request,
  res: Response
) {
  try {
    const {
      stationId,
      shiftDate,
      shiftType,
      managerId,
      assignments,
    } = req.body;

    if (!stationId || !shiftDate || !shiftType) {
      return res.status(400).json({
        success: false,
        message: "Station, date and shift type are required",
      });
    }

    const validShiftTypes = [
      "MORNING",
      "AFTERNOON",
      "NIGHT",
    ];

    if (!validShiftTypes.includes(shiftType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shift type",
      });
    }

    if (!Array.isArray(assignments)) {
      return res.status(400).json({
        success: false,
        message: "Assignments must be an array",
      });
    }

    const shiftId = await createShift({
      stationId: Number(stationId),
      shiftDate,
      shiftType,
      managerId: managerId ? Number(managerId) : null,
      assignments,
    });

    res.status(201).json({
      success: true,
      message: "Shift created successfully",
      data: {
        id: shiftId,
      },
    });
  } catch (error) {
    console.error("Error creating shift:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create shift",
    });
  }
}