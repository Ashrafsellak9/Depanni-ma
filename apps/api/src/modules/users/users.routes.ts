import { Router, type IRouter } from "express";

import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { usersController } from "./users.controller.js";

export const usersRoutes: IRouter = Router();

usersRoutes.use(authenticate);

usersRoutes.post("/push-token", asyncHandler(usersController.savePushToken));

usersRoutes.get("/me", asyncHandler(usersController.getMe));
usersRoutes.patch("/me", asyncHandler(usersController.updateMe));
usersRoutes.post("/me/addresses", asyncHandler(usersController.addAddress));
usersRoutes.delete("/me/addresses/:id", asyncHandler(usersController.deleteAddress));
usersRoutes.get("/me/history", asyncHandler(usersController.getHistory));

usersRoutes.get("/:id", asyncHandler(usersController.getById));
