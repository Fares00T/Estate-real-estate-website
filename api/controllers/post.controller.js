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
            username: true,
          },
        },
        postDetail: {
          select: {
            views: true,
          },
        },
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const getPost = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // Increment views by 1
    await prisma.postDetail.update({
      where: { postId: id },
      data: { views: { increment: 1 } },
    });

    // Fetch the post including postDetail and user info
    const post = await prisma.post.findUnique({
      where: { id },
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
          res.status(200).json({ ...post, isSaved: !!saved });
        } else {
          res.status(200).json({ ...post, isSaved: false });
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
    // 1. Create the post and get its ID
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
      },
    });

    // 2. Generate Matricule using postId
    const generateMatricule = (postId) =>
      `PROP-${postId.toString().padStart(6, "0")}`;
    const matricule = generateMatricule(newPost.id);

    // 3. Create the postDetail with Matricule and postId
    const newPostDetail = await prisma.postDetail.create({
      data: {
        ...body.postDetail,
        postId: newPost.id,
        Matricule: matricule,
      },
    });

    res.status(200).json({
      ...newPost,
      postDetail: newPostDetail,
    });
  } catch (err) {
    console.error("Failed to create post:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// In post.controller.js, update the updatePost function:

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

    // Use a transaction to ensure both post and postDetail are updated together
    const updatedPost = await prisma.$transaction(async (tx) => {
      // Update the main post
      const updatedPost = await tx.post.update({
        where: { id: postId },
        data: {
          ...postData,
          images: postData.images || [],
        },
      });

      // Update the post details
      const updatedPostDetail = await tx.postDetail.update({
        where: { postId: postId },
        data: {
          ...postDetail,
        },
      });

      return {
        ...updatedPost,
        postDetail: updatedPostDetail,
      };
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
    const post = await prisma.postDetail.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });

    res.status(200).json({ views: post.views });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to increment views" });
  }
};
