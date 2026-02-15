import jwt from "jsonwebtoken";

export function signJwt(userId: number) {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "3h" }
  );
}
