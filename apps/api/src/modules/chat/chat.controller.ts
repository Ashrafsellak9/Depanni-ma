import type { Request, Response } from "express";

import { getParam } from "../../utils/params.js";
import { sendCreated, sendSuccess } from "../../utils/response.js";
import { chatService } from "./chat.service.js";

export class ChatController {
  listConversations = async (req: Request, res: Response): Promise<void> => {
    const conversations = await chatService.listConversations(req.user!.id);
    sendSuccess(res, conversations);
  };

  getMessages = async (req: Request, res: Response): Promise<void> => {
    const result = await chatService.getMessages(
      getParam(req, "missionId"),
      req.user!.id,
      req.user!.role,
      req.query,
    );
    sendSuccess(res, result);
  };

  sendMessage = async (req: Request, res: Response): Promise<void> => {
    const file = req.file;
    const message = await chatService.sendMessage(
      getParam(req, "missionId"),
      req.user!.id,
      req.user!.role,
      req.body,
      file,
    );
    sendCreated(res, message);
  };
}

export const chatController = new ChatController();
