import prisma from "../config/prisma.js";

// Prisma "model delegate" (has: findUnique, create, update, etc.)
const User = prisma.user;

export default User;
