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
  CheckCircle as CheckCircleIcon
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
}

const AnswerList: React.FC<AnswerListProps> = ({
  userRole,
  answers,
  currentUserId,
  // questionAuthorId,
  onAnswerAccepted,
  onAnswerEdit,
  onAnswerDelete,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const handleEditClick = (answer: Answer) => {
    setEditingId(answer.id);
    setEditContent(answer.content);
  };

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
              {/* Ảnh đại diện */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {answer.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Phần nội dung */}
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
                  <CommentList answerId={answer.id} />
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default AnswerList;
