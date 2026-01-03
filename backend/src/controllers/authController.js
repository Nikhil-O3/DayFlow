import prisma from "../config/prisma.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import generateToken from "../config/token.js";

/**
 * Convert frontend role -> Prisma enum
 */
const prismaRoleFromReq = (role) => {
  if (role === "Role-1") return "Role_1";
  if (role === "Role-2") return "Role_2";
  return null;
};

/**
 * Convert Prisma enum -> frontend role
 */
const apiRoleFromDb = (role) => {
  if (role === "Role_1") return "Role-1";
  if (role === "Role_2") return "Role-2";
  return role;
};

/**
 * SIGNUP
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "empty fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "enter valid email" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "password must have 8 characters" });
    }

    const mappedRole = prismaRoleFromReq(role);
    if (!mappedRole) {
      return res.status(400).json({ message: "invalid role" });
    }

    const isUserExist = await prisma.user.findUnique({
      where: { email },
    });

    if (isUserExist) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        role: mappedRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        photoUrl: true,
        description: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      ...user,
      role: apiRoleFromDb(user.role),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "signup error" });
  }
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "empty fields" });
    }

    // 🔴 IMPORTANT: must SELECT password
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        photoUrl: true,
        description: true,
        googleId: true,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "user does not exist , register first !" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "Use Google login for this account",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "something went wrong" });
    }

    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user;

    return res.status(201).json({
      ...safeUser,
      role: apiRoleFromDb(user.role),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "login error" });
  }
};

/**
 * GOOGLE SUCCESS
 */
export const googleSuccess = async (req, res) => {
  try {
    const user = req.user;

    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(
      process.env.CLIENT_URL || "http://localhost:5173"
    );
  } catch (error) {
    console.error(error);
    return res.redirect("/login");
  }
};

/**
 * LOGOUT
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "logout error" });
  }
};

/**
 * GET ME
 */
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        ...user,
        role: apiRoleFromDb(user.role),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
