import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "super-secret-key";

export type JwtPayload = {
  id: number;
  role:
    | "admin"
    | "retailer"
    | "dispatcher"
    | "rider";
};

export const generateToken = (
  id: number,
  role: JwtPayload["role"]
) => {
  return jwt.sign(
    {
      id,
      role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyToken = (
  token: string
) => {
  return jwt.verify(
    token,
    JWT_SECRET
  ) as JwtPayload;
};