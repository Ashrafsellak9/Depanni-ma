import type { Request, Response } from "express";

import { sendCreated, sendSuccess } from "../../utils/response.js";
import { reviewsService } from "./reviews.service.js";

export class ReviewsController {
  create = async (req: Request, res: Response): Promise<void> => {
    const review = await reviewsService.create(req.user!.id, req.body);
    sendCreated(res, review);
  };

  listMine = async (req: Request, res: Response): Promise<void> => {
    const items = await reviewsService.listForArtisan(req.user!.id);
    sendSuccess(res, items);
  };
}

export const reviewsController = new ReviewsController();
