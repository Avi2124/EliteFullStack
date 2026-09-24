import jwt, { type SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not defined");
}

if (!REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET is not defined");
}

const ACCESS_EXPIRES_IN =
  (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as NonNullable<
    SignOptions["expiresIn"]
  >;

const REFRESH_EXPIRES_IN =
  (process.env.JWT_REFRESH_EXPIRES_IN ?? "7d") as NonNullable<
    SignOptions["expiresIn"]
  >;

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};