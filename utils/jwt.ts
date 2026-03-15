import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET1!;

export function generateResultToken(studentId: string, omrCode: string) {
  return jwt.sign(
    { studentId, omrCode },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
}

export function verifyResultToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as {
    studentId: string;
    omrCode: string;
  };
}