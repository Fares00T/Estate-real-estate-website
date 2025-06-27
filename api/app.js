import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.rout.js";
import chatRoute from "./routes/chat.rout.js";
import applyRoute from "./routes/apply.route.js";
import reportRoute from "./routes/report.route.js";
import messageRoute from "./routes/message.route.js";
import statsRoutes from "./routes/statistics.route.js";
import tourRoute from "./routes/tour.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL, // Using environment variable
    credentials: true,
  })
);

app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/stats", statsRoutes);
app.use("/api/apply", applyRoute);
app.use("/api/report", reportRoute);
app.use("/api/tours", tourRoute);

app.listen(8800, () => {
  console.log("Server is running!");
});
