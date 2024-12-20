// src/components/Comment/CommentList.tsx
import React, { useState, useEffect, useCallback } from "react";
import { TextField, IconButton, Tooltip } from "@mui/material";
// import ReplyIcon from "@mui/icons-material/Reply";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useAuth } from "../../../context/AuthContext";
import { commentApi } from "../../../../api/forum.service";
import Comment from "@/constant/Comment";
import { adminService } from "../../../../api/admin.service";
import { useSocket } from "../../../hooks/useSocket";
import { QAEvent } from "../../../websocket/websocket.types";

interface CommentListProps {
  answerId: number;
  isAdmin: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ answerId, isAdmin }) => {
  const { user: currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showReplyField, setShowReplyField] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [answerId]);

  const fetchComments = async () => {
    const { data } = await commentApi.getByAnswerId(answerId);
    setComments(
      data.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    );
  };
  const handleQAEvent = useCallback(
    (event: QAEvent) => {
      if (event.type === "comment" && event.data.answerId === answerId) {
        console.log("Comment event for answerId:", answerId, event);

        switch (event.action) {
          case "create":
            // Only add if comment belongs to this answer
            if (event.data.answerId === answerId) {
              setComments((prev) => [event.data, ...prev]);
            }
            break;

          case "update":
            setComments((prev) =>
              prev.map((comment) =>
                comment.id === event.data.id ? event.data : comment
              )
            );
            break;

          case "delete":
            setComments((prev) =>
              prev.filter((comment) => comment.id !== event.data.id)
            );
            break;
        }
      }
    },
    [answerId]
  );

  useSocket(handleQAEvent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await commentApi.create({
        content: newComment,
        answerId,
      });
      setNewComment("");
      setShowReplyField(false);
      fetchComments();
    } catch (error) {
      console.error("Không thể thêm bình luận:", error);
    }
  };

  const handleEdit = async (commentId: number) => {
    try {
      await commentApi.update(commentId, { content: editContent });
      setEditingId(null);
      setEditContent("");
      fetchComments();
    } catch (error) {
      console.error("Không thể cập nhật bình luận:", error);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      if (isAdmin) {
        await adminService.deleteComment(commentId);
      } else {
        await commentApi.delete(commentId);
      }
      fetchComments();
    } catch (error) {
      console.error("Không thể xóa bình luận:", error);
    }
  };

  return (
    <div className="space-y-4 mt-3">
      {/* Nút Trả lời */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setShowReplyField(true)}
          className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1"
        >
          Trả lời
        </button>
      </div>

      {/* Trường Trả lời */}
      {showReplyField && (
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">
                {currentUser?.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <TextField
              fullWidth
              size="small"
              placeholder="Viết bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-white rounded-2xl"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  setShowReplyField(false);
                  setNewComment("");
                }}
                className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={!newComment.trim()}
                className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg disabled:opacity-50"
              >
                Bình luận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách Bình luận */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            {/* Ảnh đại diện Bình luận */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {comment.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Nội dung Bình luận */}
            <div className="flex-1">
              <div className="bg-gray-100 rounded-2xl px-4 py-2">
                {/* Thông tin người dùng & Thời gian */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900">
                    {comment.user.name}
                  </span>
                  {comment.user.role === "admin" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4 text-blue-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                  {comment.isEdited && (
                    <span className="text-xs text-gray-500">
                      (đã chỉnh sửa)
                    </span>
                  )}
                  {currentUser?.id === comment.userId && !editingId && (
                    <div className="flex items-center gap-2 mt-1 ml-4">
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingId(comment.id);
                            setEditContent(comment.content);
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(comment.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                </div>

                {editingId === comment.id ? (
                  <div className="space-y-2">
                    <TextField
                      fullWidth
                      size="small"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleEdit(comment.id)}
                        className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-lg"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <p className="text-sm text-gray-700 text-left">
                      {comment.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
