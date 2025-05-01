import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        users: {
          some: { userId: tokenUserId },
        },
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const formattedChats = chats.map((chat) => {
      // Get the user who is NOT the current user (i.e., the receiver)
      const receiverUser = chat.users.find(
        (u) => u.user.id !== tokenUserId
      )?.user;

      return {
        id: chat.id,
        createdAt: chat.createdAt,
        receiver: receiverUser,
        sender: chat.users.find((u) => u.user.id === tokenUserId)?.user,
        lastMessage: chat.messages[0]?.text || null,
      };
    });

    res.status(200).json(formattedChats);
  } catch (err) {
    console.error("Error in getChats:", err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Convert chatId to an integer
    const chatId = parseInt(req.params.id); // Convert to integer

    // Check if chatId is valid
    if (isNaN(chatId)) {
      return res.status(400).json({ message: "Invalid chat ID!" });
    }

    // Find the chat with the provided chatId
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId, // Make sure chatId is an integer
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
        users: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    res.status(200).json(chat);
  } catch (err) {
    console.log("Error while getting chat:", err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const existingChat = await prisma.chat.findFirst({
      where: {
        users: {
          some: { userId: tokenUserId },
        },
        AND: {
          users: {
            some: { userId: req.body.receiverId },
          },
        },
      },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = await prisma.chat.create({
      data: {
        users: {
          create: [{ userId: tokenUserId }, { userId: req.body.receiverId }],
        },
      },
      include: {
        users: {
          include: {
            user: true, // Include full user data
          },
        },
      },
    });
    console.log("New chat created:", newChat);
    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create chat" });
  }
};
/*
export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {},
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
*/
