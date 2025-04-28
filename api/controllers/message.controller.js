import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  const tokenUserId = parseInt(req.userId); // Ensure tokenUserId is an integer
  const chatId = parseInt(req.params.chatId); // Convert chatId to an integer
  const text = req.body.text;

  try {
    // Validate if the chat exists and belongs to the user
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId, // Make sure chatId is passed as an integer
      },
      include: {
        users: true,
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    // Create the new message
    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    // Optionally, update the chat's last message (without updating seenBy)
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        lastMessage: text,
      },
    });

    res.status(200).json(message);
  } catch (err) {
    console.log("Error while adding message:", err);
    res
      .status(500)
      .json({ message: "Failed to add message!", error: err.message });
  }
};
