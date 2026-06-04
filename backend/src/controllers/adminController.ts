import { Response } from "express";
import * as bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth";

export class AdminController {
  // GET /api/admin/users
  static async getUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      res.status(200).json(users);
    } catch (error) {
      console.error("Fetch users error:", error);
      res.status(500).json({ error: "Failed to retrieve user accounts from the database." });
    }
  }

  // POST /api/admin/users
  static async createUser(req: AuthenticatedRequest, res: Response) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "All fields are required (name, email, password)." });
      return;
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        res.status(400).json({ error: "An account with this email already exists." });
        return;
      }

      // STRICTLY hash the password before writing to Supabase PostgreSQL
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "admin"
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      res.status(201).json({
        message: "User account created successfully!",
        user: newUser
      });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ error: "Failed to save the user account in the database." });
    }
  }

  // DELETE /api/admin/users/:id
  static async deleteUser(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const currentAdminId = req.user?.userId;

    if (id === currentAdminId) {
      res.status(400).json({ error: "System Protection: You cannot delete your own Administrator account." });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        res.status(404).json({ error: "User account not found." });
        return;
      }

      await prisma.user.delete({
        where: { id }
      });

      res.status(200).json({ message: "User account removed from database successfully." });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Failed to delete user account." });
    }
  }

  // GET /api/admin/dashboard-stats
  static async getDashboardStats(req: AuthenticatedRequest, res: Response) {
    try {
      const [
        totalTours,
        activeTours,
        totalResorts,
        activeResorts,
        totalUsers,
        totalBlogs,
        latestTours,
        latestResorts
      ] = await Promise.all([
        prisma.tourPackage.count(),
        prisma.tourPackage.count({ where: { status: "active" } }),
        prisma.resort.count(),
        prisma.resort.count({ where: { status: "active" } }),
        prisma.user.count(),
        prisma.blogPost.count(),
        prisma.tourPackage.findMany({
          select: { id: true, title: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 3
        }),
        prisma.resort.findMany({
          select: { id: true, title: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 3
        })
      ]);

      // Combine and sort latest activity
      const recentActivity = [
        ...latestTours.map(t => ({ ...t, type: "tour" })),
        ...latestResorts.map(r => ({ ...r, type: "resort" }))
      ]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      res.status(200).json({
        tours: { total: totalTours, active: activeTours },
        resorts: { total: totalResorts, active: activeResorts },
        users: { total: totalUsers },
        blogs: { total: totalBlogs },
        recentActivity
      });
    } catch (error) {
      console.error("Fetch dashboard stats error:", error);
      res.status(500).json({ error: "Failed to load dashboard statistics." });
    }
  }
}
