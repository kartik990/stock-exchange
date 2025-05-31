import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = verifyToken(token) as {
      id: string;
      email: string;
      username: string;
    };

    console.log(decoded);

    req.user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
