import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  try {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
  } catch (error) {
    console.error("Token generation error:", error);
    return null;
  }
};

export default generateToken;
