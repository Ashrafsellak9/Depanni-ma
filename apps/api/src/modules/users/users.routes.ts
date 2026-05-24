import { Router, type IRouter } from "express";

import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { usersController } from "./users.controller.js";

export const usersRoutes: IRouter = Router();

usersRoutes.use(authenticate);
usersRoutes.get("/me", asyncHandler(usersController.getMe));
usersRoutes.patch("/me", asyncHandler(usersController.updateMe));
usersRoutes.get("/:id", asyncHandler(usersController.getById));
