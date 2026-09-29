import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash } from "lucide-react";

import {
  getUsers,
  deleteUser,
  type User,
  type UserRole,
  updateUserStatus,
} from "../../services/userService";
import Loading from "../../components/common/Loading";

const Users = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "">("");

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(id);

      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);

      alert("Failed to delete user.");
    }
  };

    useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500);

  return () => clearTimeout(timer);
}, [search]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUsers(page, limit, debouncedSearch, role, status === "ACTIVE" ? "true" : status === "INACTIVE" ? "false" : "");

        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Failed to load users:", error);

        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, limit, debouncedSearch, role,status]);

  const handleStatusChange = async (id: string, currentStatus: boolean) => {
    try {
      await updateUserStatus(id, !currentStatus);
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === id ? { ...user, isActive: !currentStatus } : user,
        ),
      );
    } catch (error) {
      console.error("Failed to update user status:", error);
      alert("Failed to update user status.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="users-page">
      {/* Header */}
      <div className="users-page__header">
        <div>
          <h1>Users</h1>
          <p>Manage system users and their roles.</p>
        </div>

        <button type="button" onClick={() => navigate("/users/create")}>
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="users-filters">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(event) => {setSearch(event.target.value); setPage(1)}}
        />

        <select
          value={role}
          onChange={(event) => {setRole(event.target.value as UserRole | ""); setPage(1)}}
        >
          <option value="">All Roles</option>

          <option value="ADMIN">Admin</option>

          <option value="MANAGER">Manager</option>

          <option value="STAFF">Staff</option>
        </select>

        <select
          value={status}
          onChange={(event) =>{
            setStatus(event.target.value as "ACTIVE" | "INACTIVE" | "");
            setPage(1)}
          }
        >
          <option value="">All Status</option>

          <option value="ACTIVE">Active</option>

          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Users Card */}
      <div className="users-card">
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="users-table__loading"><Loading /></td></tr>
                    ): users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>{user.role}</td>

                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(user.id, user.isActive)
                        }
                      >
                        <span
                          className={`user-status ${
                            user.isActive
                              ? "user-status--active"
                              : "user-status--inactive"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </button>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => navigate(`/users/${user.id}/edit`)}
                      >
                        <Edit size={18} color="blue" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash size={18} color="red" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="users-pagination">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((currentPage) => currentPage + 1)}
            >
              Next
            </button>
          </div>
    </div>
  );
};

export default Users;
