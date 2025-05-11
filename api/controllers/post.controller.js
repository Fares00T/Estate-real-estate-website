import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;
  console.log(query);
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        district: query.district || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
      include: {
        user: {
          select: {
            role: true,
          },
        },
      },
    });

    console.log(posts);

    // setTimeout(() => {
    res.status(200).json(posts);
    // }, 3000);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = parseInt(req.params.id); // Convert to integer

  try {
    const post = await prisma.post.findUnique({
      where: { id }, // Now id is an Int
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    if (!post) return res.status(404).json({ message: "Post not found!" });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          res.status(200).json({ ...post, isSaved: saved ? true : false });
        }
      });
    } else {
      res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const userId = req.userId;
  const { postData, postDetail } = req.body;

  if (isNaN(postId)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { postDetail: true },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...postData,
        images: postData.images || [], // JSON field
        postDetail: {
          update: {
            ...postDetail,
          },
        },
      },
      include: {
        postDetail: true,
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Failed to update post:", err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tokenUserId = req.userId;

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: tokenUserId },
      select: { role: true },
    });

    if (!user) {
      return res.status(403).json({ message: "User not found!" });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: { postDetail: true, savedPosts: true }, // Include savedPosts too
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    if (post.userId !== tokenUserId && user.role !== "admin") {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // 🔥 Ensure correct deletion order
    await prisma.$transaction(async (tx) => {
      // 1️⃣ Delete SavedPosts first (if any exist)
      if (post.savedPosts.length > 0) {
        await tx.savedPost.deleteMany({
          where: { postId: id },
        });
      }

      // 2️⃣ Delete PostDetail if it exists
      if (post.postDetail) {
        await tx.postDetail.delete({
          where: { postId: id },
        });
      }

      // 3️⃣ Finally, delete the Post
      await tx.post.delete({
        where: { id },
      });
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
/*
export const incrementPostView = async (req, res) => {
  const postId = parseInt(req.params.postId);
  console.log("Received postId:", postId);

  // Check if postId is valid
  if (isNaN(postId)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    // Attempt to increment the view count
    const post = await prisma.postDetail.update({
      where: { postId }, // Use postId for the update condition
      data: {
        views: { increment: 1 }, // Increment view count by 1
      },
    });

    res.status(200).json({ views: post.views }); // Return updated views
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to increment views" });
  }
};
*/

export const incrementPostView = async (req, res) => {
  const postId = parseInt(req.params.postId);

  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });

    res.status(200).json({ views: post.views });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to increment views" });
  }
};
