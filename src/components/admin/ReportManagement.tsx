import { useEffect, useState } from "react";
import { getReports, updateReportStatus, deletePost, getPostById } from "../../utils";
import type { Report, BackendPostListItem } from "../../utils";
import { Check, Trash2, X, ExternalLink, Eye } from "lucide-react";
import PostDetailModal from "./PostDetailModal";

export default function ReportManagement() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<'post' | 'comment'>('post');
  const [selectedPost, setSelectedPost] = useState<BackendPostListItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getReports(page, 10, undefined, activeTab);
      setReports(data.reports);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset to page 1 when changing tabs
    fetchReports();
  }, [activeTab]);
  
  useEffect(() => {
    fetchReports();
  }, [page]);

  const handleStatusUpdate = async (id: string, status: "resolved" | "dismissed") => {
      try {
          await updateReportStatus(id, status);
          setReports(reports.map(r => r._id === id ? { ...r, status } : r));
      } catch (error) {
          alert("Failed to update status");
      }
  };

  const handleDeletePost = async (reportId: string, postId: string) => {
      if (!window.confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
      try {
          await deletePost(postId);
          // Auto resolve the report after deleting the post
          await updateReportStatus(reportId, "resolved");
          setReports(reports.map(r => r._id === reportId ? { ...r, status: "resolved" } : r));
          alert("Post deleted and report resolved.");
      } catch (error) {
          console.error(error);
          alert("Failed to delete post");
      }
  };

  const handleViewPost = async (postId: string) => {
      try {
          const post = await getPostById(postId);
          setSelectedPost(post);
          setShowDetailModal(true);
      } catch (error) {
          console.error("Failed to fetch post details", error);
          alert("Could not load post details. It might have been deleted.");
      }
  };

  if (loading && reports.length === 0) {
      return <div className="p-8 text-center text-gray-500">Loading reports...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('post')}
            className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'post'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Post Reports
          </button>
          <button
            onClick={() => setActiveTab('comment')}
            className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'comment'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Comment Reports
          </button>
        </nav>
      </div>
      
      <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
              {activeTab === 'post' ? 'Post Content' : 'Comment Content'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reports.map((report) => (
            <tr key={report._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {report.reporterId?.avatar ? (
                        <img src={report.reporterId.avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-xs font-bold">{report.reporterId?.userName?.[0]}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{report.reporterId?.userName || "Unknown"}</div>
                    <div className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 font-medium capitalize">{report.reason.replace(/_/g, " ")}</div>
                {report.details && <div className="text-xs text-gray-500 mt-1">{report.details}</div>}
              </td>
              <td className="px-6 py-4">
                  {activeTab === 'post' ? (
                    // Post content
                    report.postId ? (
                      <div className="text-sm text-gray-600">
                          <p className="line-clamp-2">{report.postId.text || report.postId.content || "(No text content)"}</p>
                          {report.postId.images && report.postId.images.length > 0 && (
                              <div className="mt-1 text-xs text-blue-500 flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" />
                                  Has images
                              </div>
                          )}
                           <div className="mt-1 text-xs text-gray-400">
                              Author: {report.postId.authorId?.userName || "Unknown"}
                           </div>
                      </div>
                    ) : (
                      <span className="text-sm text-red-500 italic">Post deleted or unavailable</span>
                    )
                  ) : (
                    // Comment content
                    report.commentId ? (
                      <div className="text-sm text-gray-600">
                          <p className="line-clamp-2">{report.commentId.content || "(No text content)"}</p>
                          {report.commentId.image && (
                              <div className="mt-1 text-xs text-blue-500 flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" />
                                  Has image
                              </div>
                          )}
                           <div className="mt-1 text-xs text-gray-400">
                              Author: {report.commentId.authorId?.userName || "Unknown"}
                           </div>
                      </div>
                    ) : (
                      <span className="text-sm text-red-500 italic">Comment deleted or unavailable</span>
                    )
                  )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                  {report.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {report.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => handleStatusUpdate(report._id, "dismissed")}
                            className="text-gray-600 hover:text-gray-900 p-1 bg-gray-100 rounded hover:bg-gray-200"
                            title="Dismiss Report"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        {report.postId && (
                            <>
                             <button
                                onClick={() => handleViewPost(report.postId!._id)}
                                className="text-blue-600 hover:text-blue-900 p-1 bg-blue-50 rounded hover:bg-blue-100"
                                title="View Post"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                             <button 
                                onClick={() => handleDeletePost(report._id, report.postId!._id)}
                                className="text-red-600 hover:text-red-900 p-1 bg-red-50 rounded hover:bg-red-100"
                                title="Delete Post & Resolve"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            </>
                        )}
                         <button 
                            onClick={() => handleStatusUpdate(report._id, "resolved")}
                            className="text-green-600 hover:text-green-900 p-1 bg-green-50 rounded hover:bg-green-100"
                            title="Mark Resolved"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                      </div>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                   onClick={() => setPage(p => Math.max(1, p - 1))}
                   disabled={page === 1}
                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                   onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                   disabled={page === totalPages}
                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      <PostDetailModal
        isOpen={showDetailModal}
        post={selectedPost}
        onClose={() => {
            setShowDetailModal(false);
            setSelectedPost(null);
        }}
      />
    </div>
  );
}
