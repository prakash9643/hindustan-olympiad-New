import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET1!;

export function generateResultToken(studentId: string) {
  return jwt.sign(
    { studentId },
    JWT_SECRET,
    { expiresIn: "30m" } // ⏱️ 15 minutes
  );
}

export function verifyResultToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as {
    studentId: string;
  };
}
