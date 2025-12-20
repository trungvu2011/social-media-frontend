import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllPosts,
  deleteUser,
  deletePost,
  getAdminStats,
} from "../../utils";
import type {
  UserProfile,
  BackendPostListItem,
  AdminStats,
} from "../../utils";
import AdminLayout from "../../components/admin/AdminLayout";
import DeleteModal from "../../components/admin/DeleteModal";
import PostDetailModal from "../../components/admin/PostDetailModal";
import DashboardOverview from "../../components/admin/DashboardOverview";
import ReportManagement from "../../components/admin/ReportManagement";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "posts" | "reports">("dashboard");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [posts, setPosts] = useState<BackendPostListItem[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "user" | "post";
    id: string;
    name?: string; // For user name or post snippet
  }>({ isOpen: false, type: "user", id: "" });

  const [postDetailModal, setPostDetailModal] = useState<{
    isOpen: boolean;
    post: BackendPostListItem | null;
  }>({ isOpen: false, post: null });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "dashboard") {
        const data = await getAdminStats();
        setStats(data);
      } else if (activeTab === "users") {
        const data = await getAllUsers();
        setUsers(data);
      } else {
        const res = await getAllPosts({ limit: 100 });
        setPosts(res.data);
      }
      // Added empty check for reports as it handles its own data fetching internally

    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (u) =>
      (u.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDeleteUserModal = (user: UserProfile) => {
    setDeleteModal({
      isOpen: true,
      type: "user",
      id: user._id,
      name: user.fullName || user.userName || "Unknown User",
    });
  };

  const openDeletePostModal = (post: BackendPostListItem) => {
    const snippet =
      (post.text || post.content || "").substring(0, 30) + "...";
    setDeleteModal({
      isOpen: true,
      type: "post",
      id: post._id,
      name: snippet,
    });
  };

  const confirmDelete = async () => {
    try {
      if (deleteModal.type === "user") {
        await deleteUser(deleteModal.id);
        setUsers(users.filter((u) => u._id !== deleteModal.id));
      } else {
        await deletePost(deleteModal.id);
        setPosts(posts.filter((p) => p._id !== deleteModal.id));
      }
      setDeleteModal({ ...deleteModal, isOpen: false });
    } catch (error) {
      alert("Failed to delete item");
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {activeTab === "dashboard" ? "Dashboard Overview" : activeTab === "users" ? "Manage Users" : activeTab === "posts" ? "Manage Posts" : "Manage Reports"}
        </h2>
        {activeTab === "users" && (
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Enter name or email..."
              className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : activeTab === "dashboard" ? (
        <DashboardOverview stats={stats} />
      ) : activeTab === "users" ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email / Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.avatar}
                            alt=""
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                            {(user.fullName || user.userName || "?").charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">
                          {user.fullName || user.userName}
                        </div>
                        <div className="text-xs text-gray-500">
                          @{user.userName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-xs text-gray-500">
                      Role: {user.role || "user"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        (user.postCount || 0) === 0
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      Posts: {user.postCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openDeleteUserModal(user)}
                      className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded shadow-sm font-bold transition-colors"
                    >
                      🗑️ DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === "posts" ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      {post.images && post.images.length > 0 && (
                        <img
                          src={post.images[0]}
                          alt="thumb"
                          className="w-12 h-12 rounded object-cover border border-gray-200"
                        />
                      )}
                      <div>
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {post.text || post.content || "(No content)"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {post.authorId?.fullName || "Unknown"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() =>
                        setPostDetailModal({ isOpen: true, post })
                      }
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => openDeletePostModal(post)}
                      className="text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded shadow-sm font-bold transition-colors"
                    >
                      🗑️ DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ReportManagement />
      )}

      {/* Modals */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        title="Confirm Permanent Delete?"
        message={
          deleteModal.type === "user"
            ? `You are deleting user "${deleteModal.name}". This action will delete this user and all associated data. This cannot be undone!`
            : `You are deleting this post. This action cannot be undone!`
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ ...deleteModal, isOpen: false })}
      />

      <PostDetailModal
        isOpen={postDetailModal.isOpen}
        post={postDetailModal.post}
        onClose={() => setPostDetailModal({ isOpen: false, post: null })}
      />
    </AdminLayout>
  );
}
