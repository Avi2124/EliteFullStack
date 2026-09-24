import authRepository from "../repositories/authRepository.js";

import AppError from "../utils/AppError.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

import { comparePassword, hashPassword } from "../utils/password.js";

class AuthService {
  async register(name: string, email: string, password: string) {
    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(password);

    return authRepository.createUser({
      name,
      email,
      password: hashedPassword,
    });
  }

  // ============================================================
  // LOGIN
  // ============================================================

  async login(email: string, password: string) {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // IMPORTANT:
    // Do not allow inactive users to login.
    if (!user.isActive) {
      throw new AppError(
        "Your account has been deactivated. Please contact an administrator.",
        403,
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await authRepository.createRefreshToken(user.id, refreshToken, expiresAt);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  // ============================================================
  // REFRESH ACCESS TOKEN
  // ============================================================

  async refreshAccessToken(refreshToken: string) {
    const storedToken = await authRepository.findRefreshToken(refreshToken);

    if (!storedToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    const payload = verifyRefreshToken(refreshToken);

    // Check the latest user status from database.
    const user = await authRepository.findUserById(payload.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // IMPORTANT:
    // An inactive user cannot get a new access token.
    if (!user.isActive) {
      await authRepository.deleteRefreshToken(refreshToken);

      throw new AppError(
        "Your account has been deactivated. Please contact an administrator.",
        403,
      );
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
    };
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  async logout(refreshToken: string) {
    await authRepository.deleteRefreshToken(refreshToken);

    return {
      message: "Logout Successful",
    };
  }

  // ============================================================
  // PROFILE
  // ============================================================

  async profile(userId: string) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Also prevent an inactive user from
    // accessing profile through a valid token.
    if (!user.isActive) {
      throw new AppError(
        "Your account has been deactivated. Please contact an administrator.",
        403,
      );
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}

export default new AuthService();
