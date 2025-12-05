import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type Notification,
  getPostById,
} from "../../utils";
import type { Post as PostType } from "../../types/social";
import { Heart, MessageCircle, UserPlus, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

const CommentModal = React.lazy(() => import("../../components/feed/CommentModal"));

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState<PostType | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkRead(notification._id);
    }

    if (notification.type === "follow") {
      navigate(`/profile/${notification.senderId.userName}`);
    } else if ((notification.type === "like" || notification.type === "comment") && notification.referenceId) {
       // Fetch post and open modal
       try {
        const postData: any = await getPostById(notification.referenceId);
        // Map to frontend Post type (simplified mapping, similar to HomePage)
        // Note: Ideally we share the mapping logic
        const post: PostType = {
           id: postData._id,
           content: postData.content,
           images: postData.images,
           likes: postData.likes,
           commentCount: postData.commentCount,
           shares: 0,
           createdAt: postData.createdAt,
           user: {
             id: postData.authorId._id,
             username: postData.authorId.userName,
             displayName: postData.authorId.fullName || postData.authorId.userName,
             avatar: postData.authorId.avatar,
             isVerified: false
           },
           isLiked: false // Will be set by Post component
        };
        setActivePost(post);
       } catch (error) {
         console.error("Failed to fetch post for notification", error);
         // Fallback to navigation
         navigate(`/post/${notification.referenceId}`);
       }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-500 fill-blue-500" />;
      case "follow":
        return <UserPlus className="w-5 h-5 text-green-500 fill-green-500" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {activePost && (
           <React.Suspense fallback={null}>
             <CommentModal 
                post={activePost} 
                onClose={() => setActivePost(null)}
             />
           </React.Suspense>
        )}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Check className="w-4 h-4" /> Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-4">
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-indigo-50/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="mt-1">{getIcon(notification.type)}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 break-words">
                        <Link
                          to={`/profile/${notification.senderId.userName}`}
                          className="font-semibold text-gray-900 hover:underline inline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {notification.senderId.fullName || notification.senderId.userName}
                        </Link>
                        {" "}
                        <span className="text-gray-600 inline">
                          {notification.content}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleDateString()}{" "}
                        •{" "}
                        {new Date(notification.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    {/* Sender Avatar */}
                    {notification.senderId.avatar && (
                       <img 
                         src={notification.senderId.avatar} 
                         className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                         alt=""
                       />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-500">
                When you get likes, comments or follows, they'll show up here.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationPage;
