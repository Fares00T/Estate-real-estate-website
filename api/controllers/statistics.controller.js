import prisma from "../lib/prisma.js";

export const getStatistics = async (req, res) => {
  try {
    const totalPosts = await prisma.post.count();
    const totalUsers = await prisma.user.count();

    const usersByDay = await prisma.$queryRawUnsafe(`
      SELECT DATE(createdAt) AS date, COUNT(*) AS count
      FROM \`User\`
      GROUP BY date
      ORDER BY date ASC
    `);

    const postsByDay = await prisma.$queryRawUnsafe(`
      SELECT DATE(createdAt) AS date, COUNT(*) AS count
      FROM \`Post\`
      GROUP BY date
      ORDER BY date ASC
    `);

    res.status(200).json({
      totalUsers,
      totalPosts,
      usersByDay: usersByDay.map((entry) => ({
        date: new Date(entry.date).toISOString().split("T")[0],
        count: Number(entry.count),
      })),
      postsByDay: postsByDay.map((entry) => ({
        date: new Date(entry.date).toISOString().split("T")[0],
        count: Number(entry.count),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get statistics." });
  }
};
