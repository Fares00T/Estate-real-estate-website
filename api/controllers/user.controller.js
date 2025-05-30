import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

export const updateUser = async (req, res) => {
  const id = Number(req.params.id);
  const tokenUserId = req.userId;

  try {
    // Get the logged-in user's role
    const requestingUser = await prisma.user.findUnique({
      where: { id: tokenUserId },
    });

    if (!requestingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const isAdmin = requestingUser.role === "admin";

    // If not admin and not updating their own account, deny access
    if (!isAdmin && id !== tokenUserId) {
      return res.status(403).json({ message: "Not authorized!" });
    }

    const {
      password,
      avatar,
      agencyName,
      phone,
      city,
      district,
      website,
      about,
      role, // include role
      ...inputs
    } = req.body;

    const updatedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
        ...(agencyName && { agencyName }),
        ...(phone && { phone }),
        ...(city && { city }),
        ...(district && { district }),
        ...(website && { website }),
        ...(about && { about }),
        ...(isAdmin && role && { role }), // only admins can update role
      },
    });

    const { password: _, ...rest } = updatedUser;
    res.status(200).json(rest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user!" });
  }
};

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // Step 1: Delete PostDetails linked to user's posts
    await prisma.postDetail.deleteMany({
      where: {
        post: {
          userId: id,
        },
      },
    });

    // Step 2: Delete SavedPosts where the user is involved
    await prisma.savedPost.deleteMany({
      where: {
        OR: [{ userId: id }, { post: { userId: id } }],
      },
    });

    // Step 3: Delete Posts created by the user
    await prisma.post.deleteMany({
      where: { userId: id },
    });

    // Step 4: Find all Chat IDs the user is involved in
    const chatUsers = await prisma.chatUser.findMany({
      where: { userId: id },
      select: { chatId: true },
    });
    const chatIds = [...new Set(chatUsers.map((cu) => cu.chatId))];
    /*
    // ✅ Step 5: Delete all messages in those chats
    await prisma.message.deleteMany({
      where: {
        chatId: { in: chatIds },
      },
    });
*/
    // ✅ Step 6: Delete the user's ChatUser links
    await prisma.chatUser.deleteMany({
      where: { userId: id },
    });

    // ✅ Step 7: Delete chats with no users left
    for (const chatId of chatIds) {
      const remainingUsers = await prisma.chatUser.count({
        where: { chatId },
      });

      if (remainingUsers === 0) {
        await prisma.chat.delete({
          where: { id: chatId },
        });
      }
    }

    // ✅ Step 8: Delete the user
    await prisma.user.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ message: "User and related data deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user." });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      // If the post is already saved, remove it
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      // If the post is not saved, add it to the saved list
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.error("Error saving post:", err);
    res
      .status(500)
      .json({ message: "Failed to save post!", error: err.message });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const getAgency = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "agency",
        agencyName: { not: "" },
        location: { not: "" },
        phone: { not: "" },
        website: { not: "" },
        about: { not: "" },
        //avatar: { not: "" },
      },
    });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

// Add these functions to your user.controller.js

export const getUserStatistics = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalAgencies = await prisma.user.count({
      where: { role: "agency" },
    });
    const totalClients = await prisma.user.count({
      where: { role: "client" },
    });

    const usersByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        role: true,
      },
    });

    const usersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    res.status(200).json({
      totalUsers,
      totalAgencies,
      totalClients,
      usersByRole,
      usersThisMonth,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get user statistics" });
  }
};

export const bulkDeleteUsers = async (req, res) => {
  const { userIds } = req.body;
  const currentUserId = req.userId;

  try {
    // Prevent admin from deleting themselves
    if (userIds.includes(currentUserId)) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    await prisma.user.deleteMany({
      where: {
        id: { in: userIds },
        role: { not: "admin" }, // Prevent deleting other admins
      },
    });

    res.status(200).json({ message: "Users deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete users" });
  }
};
