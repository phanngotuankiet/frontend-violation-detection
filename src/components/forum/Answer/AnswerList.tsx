// src/components/Answer/AnswerList.tsx
import React, { useState } from "react";
import {
  IconButton,
  // List,
  // ListItem,
  // Card,
  // CardContent,
  // Typography,
  // Button,
  // Box,
  TextField,
  Tooltip,
} from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  // Reply as ReplyIcon,
} from "@mui/icons-material";
// import styles from "./AnswerList.module.css";
import Answer from "@/constant/Answer";
import CommentList from "../Comment/CommentList";

interface AnswerListProps {
  userRole: string;
  answers: Answer[];
  questionId: number;
  currentUserId: number | null; // Thay đổi để cho phép null
  questionAuthorId: number;
  onAnswerAccepted: (answerId: number) => Promise<void>;
  onAnswerEdit: (answerId: number, content: string) => Promise<void>;
  onAnswerDelete: (answerId: number) => Promise<void>;
  isAdmin: boolean;
}

const AnswerList: React.FC<AnswerListProps> = ({
  userRole,
  answers,
  currentUserId,
  // questionAuthorId,
  onAnswerAccepted,
  onAnswerEdit,
  onAnswerDelete,
  isAdmin,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const handleEditClick = (answer: Answer) => {
    setEditingId(answer.id);
    setEditContent(answer.content);
  };
  console.log("admin", isAdmin);
  console.log("userRole", userRole);

  const handleSaveEdit = async (answerId: number) => {
    await onAnswerEdit(answerId, editContent);
    setEditingId(null);
    setEditContent("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  return (
    <>
      <div className="space-y-6">
        {answers
          .sort((a, b) =>
            a.isAccepted === b.isAccepted ? 0 : a.isAccepted ? -1 : 1
          )
          .map((answer) => (
            <div key={answer.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {answer.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div
                  className={`
            bg-gray-100 rounded-2xl px-4 py-3
            ${answer.isAccepted ? "ring-2 ring-emerald-500" : ""}
          `}
                >
                  {/* Thông tin người dùng & Thời gian */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {answer.user.name}
                    </span>
                    {answer.user.role === "admin" && (
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
                    <span className="text-sm text-gray-500">
                      {new Date(answer.createdAt).toLocaleDateString()}
                    </span>
                    {answer.isEdited && (
                      <span className="text-sm text-gray-500">
                        (đã chỉnh sửa)
                      </span>
                    )}
                    {answer.isAccepted && (
                      <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                        <CheckCircleIcon className="h-4 w-4" />
                        Đã chấp nhận
                      </span>
                    )}
                    <div className="flex items-center gap-4 mt-1 px-4">
                      {currentUserId === answer.user.id && (
                        <>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(answer)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              onClick={() => onAnswerDelete(answer.id)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      {userRole == "admin" && !answer.isAccepted && (
                        <Tooltip title="Chấp nhận câu trả lời">
                          <IconButton
                            size="small"
                            onClick={() => onAnswerAccepted(answer.id)}
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  {/* Nội dung câu trả lời */}
                  {editingId === answer.id ? (
                    <div className="space-y-3">
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="bg-white"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() => handleSaveEdit(answer.id)}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                          Lưu
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex">
                      <p className="text-gray-700 leading-relaxed">
                        {answer.content}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bình luận */}
                <div className="mt-2 pl-4">
                  <CommentList answerId={answer.id} isAdmin={isAdmin} />
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default AnswerList;
