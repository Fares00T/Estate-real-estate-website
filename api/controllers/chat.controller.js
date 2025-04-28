import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Find chats involving the current user by using the ChatUser join table
    const chats = await prisma.chat.findMany({
      where: {
        users: {
          some: {
            userId: tokenUserId, // check if the user is involved in the chat
          },
        },
      },
    });

    // Fetch the receiver's information (the other user in the chat)
    for (const chat of chats) {
      const receiver = await prisma.chatUser.findFirst({
        where: {
          chatId: chat.id,
          userId: {
            not: tokenUserId, // exclude the current user
          },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
      chat.receiver = receiver.user;
    }

    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
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
    // Create a new chat and add users via the ChatUser join table
    const newChat = await prisma.chat.create({
      data: {
        users: {
          create: [
            { userId: tokenUserId }, // Add current user
            { userId: req.body.receiverId }, // Add the receiver
          ],
        },
      },
    });

    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
