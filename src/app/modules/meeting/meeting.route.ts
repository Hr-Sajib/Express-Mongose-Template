// routes/meeting.route.ts
import { Router } from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { meetingController } from "./meeting.controller";
import { uploadSingleTargetSalesPdf } from "../../utils/fileUploads";


const router = Router();

// Create a new meeting (simulation)
router.post(
  '/',
  auth(),
  uploadSingleTargetSalesPdf,
  meetingController.createMeeting
);

// Get meeting by ID (must belong to user)
router.get("/:id", auth(), meetingController.getMeetingById);

// Update meeting (append transcript, update scores, finalize, etc.)
router.patch(
  "/:id",
  auth(),
//   validateRequest(MeetingValidations.updateMeetingSchema),
  meetingController.updateMeeting
);

// Delete meeting (soft or hard — here hard delete)
router.delete("/:id", auth(), meetingController.deleteMeeting);

export const MeetingRoutes = router;