import Card from "../../components/card/Card";
import { Await, useLoaderData } from "react-router-dom";
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
} from "@mui/material";

function AdminPage() {
  const data = useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const { currentUser } = useContext(AuthContext);
  const isAdmin = currentUser?.role === "admin";

  const [users, setUsers] = useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (data?.userResponse?.data) {
      setUsers(data.userResponse.data);
    }
  }, [data]);

  const fetchUsers = async () => {
    try {
      const response = await apiRequest.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [users]);

  const confirmDeleteUser = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await apiRequest.delete(`/users/${selectedUser.id}`);
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setSnackbar({
        open: true,
        message: "User deleted successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete user.",
        severity: "error",
      });
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const confirmRoleChange = (user, role) => {
    setSelectedUser(user);
    setNewRole(role);
    setOpenRoleDialog(true);
  };

  const handleConfirmRoleChange = async () => {
    try {
      await apiRequest.put(`/users/${selectedUser.id}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, role: newRole } : u
        )
      );
      setSnackbar({
        open: true,
        message: "User role updated.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating role:", error);
      setSnackbar({
        open: true,
        message: "Failed to update user role.",
        severity: "error",
      });
    } finally {
      setOpenRoleDialog(false);
    }
  };

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data?.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                postResponse?.data?.map((post) => (
                  <Card key={post.id} item={post} />
                ))
              }
            </Await>
          </Suspense>
        </div>
      </div>

      <div className="mapContainer">
        <h2>Users</h2>

        <TextField
          label="Search by name or email..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2, marginTop: 2 }}
        />

        <Select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          displayEmpty
          fullWidth
          sx={{ marginBottom: 2 }}
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="client">Client</MenuItem>
          <MenuItem value="agency">Agency</MenuItem>
        </Select>

        <div className="userList">
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table sx={{ minWidth: 100 }} aria-label="user table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .filter((user) => {
                    const name = user.username || "";
                    const email = user.email || "";
                    const role = user.role || "";
                    const matchesSearch =
                      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      email.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesRole = selectedRole
                      ? role === selectedRole
                      : true;
                    return matchesSearch && matchesRole;
                  })
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onChange={(e) =>
                            confirmRoleChange(user, e.target.value)
                          }
                          size="small"
                          fullWidth
                          variant="outlined"
                          sx={{
                            fontSize: "0.875rem",
                            padding: 0,
                            height: "40px",
                            "& .MuiSelect-select": {
                              padding: "8px",
                            },
                          }}
                        >
                          <MenuItem value="admin">Admin</MenuItem>
                          <MenuItem value="client">Client</MenuItem>
                          <MenuItem value="agency">Agency</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => confirmDeleteUser(user)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Role Change Confirmation Dialog */}
      <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)}>
        <DialogTitle>Confirm Role Change</DialogTitle>
        <DialogContent>
          Change role of <strong>{selectedUser?.username}</strong> to{" "}
          <strong>{newRole}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoleDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmRoleChange}>Yes, Change</Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AdminPage;
