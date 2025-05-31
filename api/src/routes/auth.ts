import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { comparePasswords, hashPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/jwt";

import { getPgClient } from "../utils/pgClient";
import { serialize } from "cookie";

const pgClient = getPgClient();

const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await hashPassword(password);

    await pgClient.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
      [username, email, hashedPassword]
    );

    const token = generateToken({
      username,
      email,
    });

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        domain: "localhost",
      })
    );

    res.status(200).json({
      message: "Registered successfully",
      token,
      user: { username, email },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Fetch user from PostgreSQL
    const result = await pgClient.query(
      `SELECT id, name, email, password FROM users WHERE email = $1`,
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      username: user.name,
      email: user.email,
    });

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        domain: "localhost",
      })
    );

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: { username: user.name, email: user.email },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
});

authRouter.post(
  "/logout",
  authMiddleware,
  async (req: Request, res: Response) => {
    res.status(200).json({ message: "Logged out successfully" });
  }
);

export { authRouter };
