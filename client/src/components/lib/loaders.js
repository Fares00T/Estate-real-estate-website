import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};
export const listPageLoader = async ({ request }) => {
  try {
    const query = request.url.split("?")[1] || "";

    const postPromise = apiRequest("/posts?" + query);
    const userPromise = apiRequest("/users");

    // Debugging
    console.log("Fetching posts with query:", query);
    console.log("Fetching users...");

    return defer({
      postResponse: postPromise,
      userResponse: userPromise,
    });
  } catch (error) {
    console.error("Loader Error:", error);
    throw new Response("Failed to load data", { status: 500 });
  }
};
export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  const chatPromise = apiRequest("/chats");
  const statPromise = apiRequest("/stats");
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
    statResponse: statPromise,
  });
};
export const adminPageLoader = async () => {
  try {
    const statsPromise = apiRequest("/statistics");

    return defer({
      statResponse: statsPromise,
    });
  } catch (error) {
    console.error("Admin Loader Error:", error);
    throw new Response("Failed to load admin data", { status: 500 });
  }
};
