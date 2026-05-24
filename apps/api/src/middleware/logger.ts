import type { Request, Response } from "express";
import morgan from "morgan";

import { logger } from "../utils/logger.js";

const stream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};

export const httpLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream },
);

export function logRequestMeta(req: Request, res: Response): void {
  res.on("finish", () => {
    if (req.user) {
      logger.debug("Request completed", {
        userId: req.user.id,
        method: req.method,
        path: req.path,
        status: res.statusCode,
      });
    }
  });
}
