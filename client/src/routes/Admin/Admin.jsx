import Card from "../../components/card/Card";
import UserCard from "../../components/usersCard/UserCard";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense, useState, useContext, useEffect } from "react";
import "./Admin.scss";
import apiRequest from "../../components/lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function AdminPage() {
  const data = useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState(""); // For role filtering
  const { currentUser } = useContext(AuthContext); // Get current user
  const isAdmin = currentUser?.role === "admin"; // Check if admin

  const [users, setUsers] = useState([]);

  // Load users from the loader data when available
  useEffect(() => {
    if (data?.userResponse?.data) {
      setUsers(data.userResponse.data);
    }
  }, [data]); // Ensure this runs when data updates

  // Fetch users manually in case of an issue with the loader
  const fetchUsers = async () => {
    try {
      const response = await apiRequest.get("/users"); // Adjust endpoint if needed
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // If users are empty, try fetching manually
  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [users]);

  // Delete user function
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await apiRequest.delete(`/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId)); // Remove from UI
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
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

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchInput"
        />

        {/* Role Filter Dropdown */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="roleFilter"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="client">Client</option>
          <option value="agency">Agency</option>
        </select>

        <div className="userList">
          {users
            .filter((user) => {
              const name = user.name || "";
              const email = user.email || "";
              const role = user.role || "";

              const matchesSearch =
                name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                email.toLowerCase().includes(searchTerm.toLowerCase());

              const matchesRole = selectedRole ? role === selectedRole : true;

              return matchesSearch && matchesRole;
            })
            .map((user) => (
              <UserCard key={user.id} user={user} onDelete={handleDelete} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
