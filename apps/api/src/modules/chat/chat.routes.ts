import { Router, type IRouter } from "express";

import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { chatController } from "./chat.controller.js";
import { chatMediaUpload } from "./chat.middleware.js";

export const chatRoutes: IRouter = Router();

chatRoutes.use(authenticate);

chatRoutes.get("/conversations", asyncHandler(chatController.listConversations));
chatRoutes.get(
  "/missions/:missionId/messages",
  asyncHandler(chatController.getMessages),
);
chatRoutes.post(
  "/missions/:missionId/messages",
  chatMediaUpload,
  asyncHandler(chatController.sendMessage),
);
