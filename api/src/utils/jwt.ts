import jwt from "jsonwebtoken";

const JWT_SECRET = "abcdefghijkl";

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET);
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
