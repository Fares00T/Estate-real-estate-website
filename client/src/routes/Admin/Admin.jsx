// routes/Admin/Admin.jsx
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useState, useContext, useEffect } from "react";
import "./Admin.scss";
import apiRequest from "../../components/lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Checkbox,
  IconButton,
  Tooltip,
  LinearProgress,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Stack,
} from "@mui/material";
import {
  BarChart,
  PieChart,
  Gauge,
  LineChart,
  SparkLineChart,
} from "@mui/x-charts";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box className="tab-content">{children}</Box>}
    </div>
  );
}

function AdminPage() {
  const data = useLoaderData();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  // Tab state
  const [tabValue, setTabValue] = useState(0);

  // Data states
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedUserRole, setSelectedUserRole] = useState("");
  const [postSearchTerm, setPostSearchTerm] = useState("");
  const [selectedPostType, setSelectedPostType] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");

  // Selection states
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);

  // Dialog states
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [bulkAction, setBulkAction] = useState("");

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load data on component mount
  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  // Load statistics from loader
  useEffect(() => {
    if (data?.statResponse) {
      data.statResponse
        .then((response) => {
          setStatistics(response.data);
        })
        .catch((err) => {
          console.error("Error loading statistics:", err);
        });
    }
  }, [data]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      showSnackbar("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await apiRequest.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      showSnackbar("Failed to fetch posts", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // User Management Functions
  const handleDeleteUser = async (userId) => {
    try {
      await apiRequest.delete(`/users/${userId}`);
      setUsers(users.filter((u) => u.id !== userId));
      showSnackbar("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar("Failed to delete user", "error");
    }
    setOpenDeleteDialog(false);
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await apiRequest.put(`/users/${userId}`, { role });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u))
      );
      showSnackbar("User role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
      showSnackbar("Failed to update user role", "error");
    }
    setOpenRoleDialog(false);
  };

  // Post Management Functions
  const handleDeletePost = async (postId) => {
    try {
      await apiRequest.delete(`/posts/${postId}`);
      setPosts(posts.filter((p) => p.id !== postId));
      showSnackbar("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      showSnackbar("Failed to delete post", "error");
    }
    setOpenDeleteDialog(false);
  };

  // Bulk Actions
  const handleBulkAction = async () => {
    if (tabValue === 1 && bulkAction === "delete") {
      try {
        await Promise.all(
          selectedUsers.map((userId) => apiRequest.delete(`/users/${userId}`))
        );
        setUsers(users.filter((u) => !selectedUsers.includes(u.id)));
        setSelectedUsers([]);
        showSnackbar(`${selectedUsers.length} users deleted successfully`);
      } catch (error) {
        showSnackbar("Failed to delete users", "error");
      }
    } else if (tabValue === 2 && bulkAction === "delete") {
      try {
        await Promise.all(
          selectedPosts.map((postId) => apiRequest.delete(`/posts/${postId}`))
        );
        setPosts(posts.filter((p) => !selectedPosts.includes(p.id)));
        setSelectedPosts([]);
        showSnackbar(`${selectedPosts.length} posts deleted successfully`);
      } catch (error) {
        showSnackbar("Failed to delete posts", "error");
      }
    }
    setOpenBulkDialog(false);
  };

  // Data Export
  const exportData = (type) => {
    let data, filename;

    if (type === "users") {
      data = users.map((u) => ({
        ID: u.id,
        Username: u.username,
        Email: u.email,
        Role: u.role,
        CreatedAt: new Date(u.createdAt).toLocaleDateString(),
        AgencyName: u.agencyName || "N/A",
        Phone: u.phone || "N/A",
      }));
      filename = "users_export.csv";
    } else {
      data = posts.map((p) => ({
        ID: p.id,
        Title: p.title,
        Price: p.price,
        City: p.city,
        District: p.district,
        Type: p.type,
        Property: p.property,
        PropertyType: p.propertyType,
        CreatedAt: new Date(p.createdAt).toLocaleDateString(),
        Owner: p.user?.username || "Unknown",
      }));
      filename = "posts_export.csv";
    }

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Filter functions
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = selectedUserRole
      ? user.role === selectedUserRole
      : true;
    return matchesSearch && matchesRole;
  });

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(postSearchTerm.toLowerCase()) ||
      post.city?.toLowerCase().includes(postSearchTerm.toLowerCase());
    const matchesType = selectedPostType
      ? post.type === selectedPostType
      : true;
    const matchesProperty = selectedProperty
      ? post.property === selectedProperty
      : true;
    return matchesSearch && matchesType && matchesProperty;
  });

  // Statistics calculations
  const getUserRoleData = () => {
    const roleCount = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(roleCount).map(([role, count]) => ({
      label: role.charAt(0).toUpperCase() + role.slice(1),
      value: count,
    }));
  };

  const getPostTypeData = () => {
    const typeCount = posts.reduce((acc, post) => {
      acc[post.type] = (acc[post.type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(typeCount).map(([type, count]) => ({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
    }));
  };

  const getPropertyData = () => {
    const propertyCount = posts.reduce((acc, post) => {
      acc[post.property] = (acc[post.property] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(propertyCount).map(([property, count]) => ({
      label: property.charAt(0).toUpperCase() + property.slice(1),
      value: count,
    }));
  };

  const getCityData = () => {
    const cityCount = posts.reduce((acc, post) => {
      acc[post.city] = (acc[post.city] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(cityCount)
      .map(([city, count]) => ({ label: city, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

  const getMonthlyData = () => {
    if (!statistics) return [];

    const allDates = Array.from(
      new Set([
        ...(statistics.usersByDay || []).map((u) => u.date),
        ...(statistics.postsByDay || []).map((p) => p.date),
      ])
    ).sort();

    return allDates.map((date) => {
      const userEntry = statistics.usersByDay?.find((u) => u.date === date);
      const postEntry = statistics.postsByDay?.find((p) => p.date === date);

      return {
        date,
        users: userEntry?.count || 0,
        posts: postEntry?.count || 0,
      };
    });
  };

  return (
    <div className="admin-dashboard">
      <Box className="dashboard-container">
        <Box className="dashboard-header">
          <Typography variant="h4" className="dashboard-title">
            Admin Dashboard
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              fetchUsers();
              fetchPosts();
            }}
            className="refresh-button"
          >
            Refresh Data
          </Button>
        </Box>

        <Box className="dashboard-tabs">
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            className="main-tabs"
          >
            <Tab icon={<DashboardIcon />} label="Dashboard" />
            <Tab icon={<PeopleIcon />} label="Users" />
            <Tab icon={<HomeIcon />} label="Properties" />
            <Tab icon={<AnalyticsIcon />} label="Analytics" />
            <Tab icon={<SettingsIcon />} label="System" />
          </Tabs>
        </Box>

        {/* Dashboard Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3} className="dashboard-overview">
            <Grid item xs={12} sm={6} md={3}>
              <Card className="stat-card users-card">
                <CardContent>
                  <Box className="stat-content">
                    <PeopleIcon className="stat-icon" />
                    <Box>
                      <Typography variant="h3" className="stat-number">
                        {users.length}
                      </Typography>
                      <Typography variant="body2" className="stat-label">
                        Total Users
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className="stat-card properties-card">
                <CardContent>
                  <Box className="stat-content">
                    <HomeIcon className="stat-icon" />
                    <Box>
                      <Typography variant="h3" className="stat-number">
                        {posts.length}
                      </Typography>
                      <Typography variant="body2" className="stat-label">
                        Total Properties
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className="stat-card agencies-card">
                <CardContent>
                  <Box className="stat-content">
                    <BusinessIcon className="stat-icon" />
                    <Box>
                      <Typography variant="h3" className="stat-number">
                        {users.filter((u) => u.role === "agency").length}
                      </Typography>
                      <Typography variant="body2" className="stat-label">
                        Agencies
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className="stat-card revenue-card">
                <CardContent>
                  <Box className="stat-content">
                    <AssignmentIcon className="stat-icon" />
                    <Box>
                      <Typography variant="h3" className="stat-number">
                        {posts.filter((p) => p.type === "rent").length}
                      </Typography>
                      <Typography variant="body2" className="stat-label">
                        For Rent
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} className="charts-section">
            <Grid item xs={12} md={6}>
              <Paper className="chart-container">
                <Typography variant="h6" className="chart-title">
                  Users by Role
                </Typography>
                <PieChart
                  series={[
                    {
                      data: getUserRoleData(),
                      innerRadius: 40,
                      outerRadius: 100,
                    },
                  ]}
                  height={300}
                  slotProps={{
                    legend: {
                      direction: "horizontal",
                      position: { vertical: "bottom", horizontal: "middle" },
                    },
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper className="chart-container">
                <Typography variant="h6" className="chart-title">
                  Properties by Type
                </Typography>
                <BarChart
                  dataset={getPostTypeData()}
                  xAxis={[{ scaleType: "band", dataKey: "label" }]}
                  series={[{ dataKey: "value", label: "Properties" }]}
                  height={300}
                />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Users Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box className="section-header">
            <Typography variant="h5">User Management</Typography>
            <Stack direction="horizontal" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => exportData("users")}
              >
                Export Users
              </Button>
              {selectedUsers.length > 0 && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setBulkAction("delete");
                    setOpenBulkDialog(true);
                  }}
                >
                  Delete Selected ({selectedUsers.length})
                </Button>
              )}
            </Stack>
          </Box>

          <Box className="filters-section">
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  label="Search users..."
                  variant="outlined"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  fullWidth
                  className="search-field"
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <FormControl fullWidth sx={{ width: 200 }} md={{ width: 200 }}>
                  <InputLabel>Filter by Role</InputLabel>
                  <Select
                    value={selectedUserRole}
                    onChange={(e) => setSelectedUserRole(e.target.value)}
                    label="All Roles"
                    fullWidth
                    sx={{ height: 56 }}
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="client">Client</MenuItem>
                    <MenuItem value="agency">Agency</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {loading ? (
            <Box className="loading-container">
              <CircularProgress />
              <Typography>Loading users...</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} className="data-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedUsers.length > 0 &&
                          selectedUsers.length < filteredUsers.length
                        }
                        checked={
                          filteredUsers.length > 0 &&
                          selectedUsers.length === filteredUsers.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(filteredUsers.map((u) => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>Avatar</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Agency Info</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="table-row">
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(
                                selectedUsers.filter((id) => id !== user.id)
                              );
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Avatar
                          src={user.avatar || "/noavatar.jpg"}
                          alt="Avatar"
                          className="user-avatar"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {user.username}
                        </Typography>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={
                            user.role === "admin"
                              ? "error"
                              : user.role === "agency"
                              ? "primary"
                              : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {user.role === "agency" ? (
                          <Box>
                            <Typography variant="caption" display="block">
                              {user.agencyName || "No name"}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {user.phone || "No phone"}
                            </Typography>
                          </Box>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Stack direction="horizontal" spacing={1}>
                          <FormControl size="small">
                            <Select
                              value={user.role}
                              onChange={(e) => {
                                setSelectedItem(user);
                                setNewRole(e.target.value);
                                setOpenRoleDialog(true);
                              }}
                              className="role-select"
                            >
                              <MenuItem value="admin">Admin</MenuItem>
                              <MenuItem value="client">Client</MenuItem>
                              <MenuItem value="agency">Agency</MenuItem>
                            </Select>
                          </FormControl>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setSelectedItem(user);
                              setOpenDeleteDialog(true);
                            }}
                            className="delete-button"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Properties Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box className="section-header">
            <Typography variant="h5">Property Management</Typography>
            <Stack direction="horizontal" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => exportData("posts")}
              >
                Export Properties
              </Button>
              {selectedPosts.length > 0 && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setBulkAction("delete");
                    setOpenBulkDialog(true);
                  }}
                >
                  Delete Selected ({selectedPosts.length})
                </Button>
              )}
            </Stack>
          </Box>

          <Box className="filters-section">
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Search properties..."
                  variant="outlined"
                  value={postSearchTerm}
                  onChange={(e) => setPostSearchTerm(e.target.value)}
                  fullWidth
                  className="search-field"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={{ width: 200 }} md={{ width: 200 }}>
                  <InputLabel>Filter by Type</InputLabel>
                  <Select
                    value={selectedPostType}
                    onChange={(e) => setSelectedPostType(e.target.value)}
                    label="Filter by Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="rent">Rent</MenuItem>
                    <MenuItem value="buy">Buy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={{ width: 200 }} md={{ width: 200 }}>
                  <InputLabel>Filter by Property</InputLabel>
                  <Select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    label="Filter by Property"
                  >
                    <MenuItem value="">All Properties</MenuItem>
                    <MenuItem value="residential">Residential</MenuItem>
                    <MenuItem value="commercial">Commercial</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <TableContainer component={Paper} className="data-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedPosts.length > 0 &&
                        selectedPosts.length < filteredPosts.length
                      }
                      checked={
                        filteredPosts.length > 0 &&
                        selectedPosts.length === filteredPosts.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPosts(filteredPosts.map((p) => p.id));
                        } else {
                          setSelectedPosts([]);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Views</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id} className="table-row">
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedPosts.includes(post.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPosts([...selectedPosts, post.id]);
                          } else {
                            setSelectedPosts(
                              selectedPosts.filter((id) => id !== post.id)
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar
                        src={post.images?.[0] || "/noimage.jpg"}
                        alt="Property"
                        variant="rounded"
                        className="property-image"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" noWrap>
                        {post.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" color="primary">
                        DZD {post.price?.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {post.city}, {post.district}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={post.type}
                        color={post.type === "rent" ? "primary" : "secondary"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={post.property}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{post.user?.username || "Unknown"}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {post.postDetail?.views || 0} views
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="horizontal" spacing={1}>
                        <Tooltip title="View Property">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/${post.id}`)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Property">
                          <IconButton
                            color="error"
                            onClick={() => {
                              setSelectedItem(post);
                              setOpenDeleteDialog(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" className="section-title">
            Advanced Analytics
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper className="chart-container">
                <Typography variant="h6" className="chart-title">
                  Property Distribution by Category
                </Typography>
                <PieChart
                  series={[
                    {
                      data: getPropertyData(),
                      innerRadius: 50,
                      outerRadius: 120,
                    },
                  ]}
                  height={350}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper className="chart-container">
                <Typography variant="h6" className="chart-title">
                  Top 10 Cities by Properties
                </Typography>
                <BarChart
                  dataset={getCityData()}
                  xAxis={[{ scaleType: "band", dataKey: "label" }]}
                  series={[{ dataKey: "value", label: "Properties" }]}
                  height={350}
                />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className="analytics-summary">
                <Typography variant="h6" gutterBottom>
                  Platform Summary
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box className="metric-box">
                      <Typography variant="h4" color="primary">
                        {(
                          (posts.filter((p) => p.type === "rent").length /
                            posts.length) *
                          100
                        ).toFixed(1)}
                        %
                      </Typography>
                      <Typography variant="body2">
                        Properties for Rent
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box className="metric-box">
                      <Typography variant="h4" color="secondary">
                        {(
                          (users.filter((u) => u.role === "agency").length /
                            users.length) *
                          100
                        ).toFixed(1)}
                        %
                      </Typography>
                      <Typography variant="body2">Agency Users</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box className="metric-box">
                      <Typography variant="h4" color="success.main">
                        {posts.length > 0
                          ? Math.round(
                              posts.reduce((sum, p) => sum + p.price, 0) /
                                posts.length
                            ).toLocaleString()
                          : 0}
                      </Typography>
                      <Typography variant="body2">
                        Average Property Price
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box className="metric-box">
                      <Typography variant="h4" color="warning.main">
                        {posts
                          .reduce(
                            (sum, p) => sum + (p.postDetail?.views || 0),
                            0
                          )
                          .toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        Total Property Views
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* System Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h5" className="section-title">
            System Management
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper className="system-card">
                <Box className="system-header">
                  <StorageIcon />
                  <Typography variant="h6">Database Statistics</Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Total Records"
                      secondary={`${users.length + posts.length} records`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="User Records"
                      secondary={`${users.length} users`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Property Records"
                      secondary={`${posts.length} properties`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Active Agencies"
                      secondary={`${
                        users.filter((u) => u.role === "agency").length
                      } agencies`}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper className="system-card">
                <Box className="system-header">
                  <SecurityIcon />
                  <Typography variant="h6">Security Overview</Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Admin Users"
                      secondary={`${
                        users.filter((u) => u.role === "admin").length
                      } administrators`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Recent Activity"
                      secondary="All systems operational"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Data Integrity"
                      secondary="All records validated"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid container item xs={12}>
              <Paper className="system-actions">
                <Typography variant="h6" gutterBottom>
                  System Actions
                </Typography>
                <Stack direction="horizontal" spacing={2} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => exportData("users")}
                  >
                    Export All Users
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => exportData("posts")}
                  >
                    Export All Properties
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => {
                      fetchUsers();
                      fetchPosts();
                    }}
                  >
                    Refresh All Data
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          className="confirmation-dialog"
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            {selectedItem?.username ? "user" : "property"}?
            {selectedItem?.username && (
              <Typography color="error" variant="body2">
                User: {selectedItem.username}
              </Typography>
            )}
            {selectedItem?.title && (
              <Typography color="error" variant="body2">
                Property: {selectedItem.title}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button
              color="error"
              onClick={() => {
                if (selectedItem?.username) {
                  handleDeleteUser(selectedItem.id);
                } else {
                  handleDeletePost(selectedItem.id);
                }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Role Change Confirmation Dialog */}
        <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)}>
          <DialogTitle>Confirm Role Change</DialogTitle>
          <DialogContent>
            Change role of <strong>{selectedItem?.username}</strong> to{" "}
            <strong>{newRole}</strong>?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRoleDialog(false)}>Cancel</Button>
            <Button onClick={() => handleRoleChange(selectedItem.id, newRole)}>
              Change Role
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Action Dialog */}
        <Dialog open={openBulkDialog} onClose={() => setOpenBulkDialog(false)}>
          <DialogTitle>Confirm Bulk Action</DialogTitle>
          <DialogContent>
            Are you sure you want to {bulkAction} the selected items?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBulkDialog(false)}>Cancel</Button>
            <Button color="error" onClick={handleBulkAction}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
}

export default AdminPage;
