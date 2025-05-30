import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profile.scss";
import apiRequest from "../../components/lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
//import DatePicker from "react-datepicker";
import React, { useState } from "react";
//import "react-datepicker/dist/react-datepicker.css";
import { Container, Typography, Grid, Paper, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { Alert } from "@mui/material";
import UserTourRequests from "../../components/userTourRequests/UserTourRequests";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import axios from "axios";

function Profile() {
  const data = useLoaderData();
  const [selectedDate, setSelectedDate] = useState(null);

  const formatDate = (date) => format(date, "yyyy-MM-dd"); // Ensure the format stays consistent with local timezone

  const { updateUser, currentUser } = useContext(AuthContext);

  console.log("Current User:", currentUser.role); // Check user role

  const navigate = useNavigate();

  const handleDelete = async (postId) => {
    try {
      await apiRequest.delete(`/posts/${postId}`);
      navigate(0); // Refresh page
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            {currentUser.role === "agency" && (
              <>
                <span>
                  Agency Name: <b>{currentUser.agencyName || "N/A"}</b>
                </span>
                <span>
                  Location: <b>{currentUser.location || "N/A"}</b>
                </span>
                <span>
                  Phone Number: <b>{currentUser.phone || "N/A"}</b>
                </span>
                <span>
                  Website: <b>{currentUser.website || "N/A"}</b>
                </span>
                {/* Check for missing fields */}
                {(!currentUser.agencyName ||
                  !currentUser.avatar ||
                  !currentUser.location ||
                  !currentUser.phone ||
                  !currentUser.website) && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Please complete all your agency details to appear on the
                    agencies page.
                  </Alert>
                )}
              </>
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
          {currentUser?.role === "agency" && (
            <Link to="/agency-dashboard">
              <button className="btn btn-dashboard">
                📊 Tour Requests Dashboard
              </button>
            </Link>
          )}
          {currentUser?.role === "client" && (
            <>
              <div className="title">
                <h1>Tour Requests</h1>
              </div>
              <UserTourRequests currentUser={currentUser} />
            </>
          )}
          {currentUser?.role !== "admin" ? (
            <>
              <div className="title">
                <h1>My List</h1>
                <Link to="/add">
                  <button>Create New Post</button>
                </Link>
              </div>
              <Suspense fallback={<p>Loading...</p>}>
                <Await
                  resolve={data.postResponse}
                  errorElement={<p>Error loading posts!</p>}
                >
                  {(postResponse) => (
                    <List
                      posts={postResponse?.data?.userPosts || []}
                      onDelete={handleDelete}
                      currentUser={currentUser}
                    />
                  )}
                </Await>
              </Suspense>
              <div className="title">
                <h1>Saved List</h1>
              </div>
              <Suspense fallback={<p>Loading...</p>}>
                <Await
                  resolve={data.postResponse}
                  errorElement={<p>Error loading posts!</p>}
                >
                  {(postResponse) => (
                    <List
                      posts={postResponse.data.savedPosts}
                      onDelete={handleDelete}
                    />
                  )}
                </Await>
              </Suspense>
            </>
          ) : (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                  Statistics
                </Typography>
              </Box>

              <Suspense
                fallback={<Typography>Loading admin data...</Typography>}
              >
                <Await
                  resolve={data.statResponse}
                  errorElement={
                    <Typography color="error">
                      Error loading admin data!
                    </Typography>
                  }
                >
                  {(statResponse) => {
                    const usersByDay = statResponse?.data?.usersByDay || [];
                    const postsByDay = statResponse?.data?.postsByDay || [];

                    const selectedDateStr = selectedDate
                      ? formatDate(selectedDate)
                      : null;

                    const usersOnDate = usersByDay.find(
                      (u) => u.date === selectedDateStr
                    );
                    const postsOnDate = postsByDay.find(
                      (p) => p.date === selectedDateStr
                    );

                    // ✅ Here is the new merged logic:
                    const allDates = Array.from(
                      new Set([
                        ...usersByDay.map((u) => u.date),
                        ...postsByDay.map((p) => p.date),
                      ])
                    ).sort();

                    const chartData = allDates.map((date) => {
                      const userEntry = usersByDay.find((u) => u.date === date);
                      const postEntry = postsByDay.find((p) => p.date === date);

                      return {
                        date,
                        users: userEntry?.count || 0,
                        posts: postEntry?.count || 0,
                      };
                    });

                    console.log("Chart Data:", chartData);
                    return (
                      <Box>
                        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            Platform Overview
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              gap: 4,
                              flexWrap: "wrap",
                              justifyContent: "center",
                            }}
                          >
                            <Box sx={{ textAlign: "center" }}>
                              <Gauge
                                value={statResponse?.data?.totalUsers || 0}
                                valueMax={50} // Adjust max value based on your expectations
                                startAngle={-110}
                                endAngle={110}
                                width={200}
                                height={120}
                                sx={{
                                  [`& .${gaugeClasses.valueText}`]: {
                                    fontSize: 20,
                                  },
                                }}
                                text={({ value, valueMax }) =>
                                  `Users: ${value}`
                                }
                              />
                            </Box>

                            <Box sx={{ textAlign: "center" }}>
                              <Gauge
                                value={statResponse?.data?.totalPosts || 0}
                                valueMax={50} // Adjust accordingly
                                startAngle={-110}
                                endAngle={110}
                                width={200}
                                height={120}
                                color="#ffffff"
                                sx={{
                                  [`& .${gaugeClasses.valueText}`]: {
                                    fontSize: 20,
                                  },
                                  [`& .${gaugeClasses.valueArc}`]: {
                                    fill: "#f57c00",
                                  },
                                }}
                                text={({ value }) => `Posts: ${value}`}
                              />
                            </Box>
                          </Box>
                        </Paper>

                        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            Select a date to filter:
                          </Typography>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label="Pick a date"
                              value={selectedDate}
                              onChange={(date) => setSelectedDate(date)}
                              slotProps={{
                                textField: { fullWidth: true },
                              }}
                            />
                          </LocalizationProvider>
                        </Paper>

                        {selectedDate && (
                          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                              <b>{formatDate(selectedDate)}</b>
                            </Typography>
                            <Typography variant="body1">
                              Users registered: <b>{usersOnDate?.count || 0}</b>
                            </Typography>
                            <Typography variant="body1">
                              Posts created: <b>{postsOnDate?.count || 0}</b>
                            </Typography>
                          </Paper>
                        )}

                        <Paper elevation={2} sx={{ p: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            Daily Activity Chart
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={chartData}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 0,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis allowDecimals={false} />
                              <Tooltip />
                              <Legend />
                              <Bar
                                dataKey="users"
                                fill="#1976d2"
                                name="Users Registered"
                              />
                              <Bar
                                dataKey="posts"
                                fill="#f57c00"
                                name="Posts Created"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </Paper>
                        <Paper elevation={2} sx={{ p: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            Daily Activity Chart
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                              data={chartData}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 0,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis allowDecimals={false} />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#1976d2"
                                name="Users Registered"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="posts"
                                stroke="#f57c00"
                                name="Posts Created"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </Paper>
                      </Box>
                    );
                  }}
                </Await>
              </Suspense>
            </>
          )}
        </div>

        <div></div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Profile;
