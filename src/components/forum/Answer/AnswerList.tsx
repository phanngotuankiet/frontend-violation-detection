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
  Reply as ReplyIcon,
} from "@mui/icons-material";
// import styles from "./AnswerList.module.css";
import Answer from "@/constant/Answer";
import CommentList from "../Comment/CommentList";

interface AnswerListProps {
  userRole: string;
  answers: Answer[];
  questionId: number;
  currentUserId: number | null; // Change to allow null
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
      {/* <List className={styles.answerList}>
        {answers
          .sort((a, b) =>
            a.isAccepted === b.isAccepted ? 0 : a.isAccepted ? -1 : 1
          )
          .map((answer) => (
            <ListItem key={answer.id} className={styles.answerItem}>
              <Card
                className={`${styles.answerCard} ${
                  answer.isAccepted ? styles.acceptedAnswer : ""
                }`}
              >
                <CardContent>
                  <Box className={styles.answerHeader}>
                    {answer.isAccepted && (
                      <Box className={styles.acceptedBadge}>
                        <CheckCircleIcon color="success" />
                        <Typography color="success">Accepted Answer</Typography>
                      </Box>
                    )}
                    {answer.isEdited && (
                      <Typography variant="caption" color="textSecondary">
                        (edited)
                      </Typography>
                    )}
                  </Box>

                  {editingId === answer.id ? (
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleSaveEdit(answer.id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Typography variant="body1">{answer.content}</Typography>

                      <Box className={styles.answerFooter}>
                        <Typography variant="caption" color="textSecondary">
                          Answered by {answer.user.name} on{" "}
                          {new Date(answer.createdAt).toLocaleDateString()}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                            mt: 2,
                          }}
                        >
                          {currentUserId === answer.user.id && (
                            <>
                              <Button
                                startIcon={<EditIcon />}
                                size="small"
                                variant="outlined"
                                onClick={() => handleEditClick(answer)}
                              ></Button>
                              <Button
                                startIcon={<DeleteIcon />}
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => onAnswerDelete(answer.id)}
                              ></Button>
                            </>
                          )}
                          {currentUserId === questionAuthorId &&
                            !answer.isAccepted && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                onClick={() => onAnswerAccepted(answer.id)}
                              ></Button>
                            )}
                        </Box>
                      </Box>
                    </>
                  )}

                  <CommentList answerId={answer.id} />
                </CardContent>
              </Card>
            </ListItem>
          ))}
      </List> */}

      <div className="space-y-6">
        {answers
          .sort((a, b) =>
            a.isAccepted === b.isAccepted ? 0 : a.isAccepted ? -1 : 1
          )
          .map((answer) => (
            <div key={answer.id} className="flex space-x-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {answer.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1">
                <div
                  className={`
            bg-gray-100 rounded-2xl px-4 py-3
            ${answer.isAccepted ? "ring-2 ring-emerald-500" : ""}
          `}
                >
                  {/* User Info & Timestamp */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {answer.user.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(answer.createdAt).toLocaleDateString()}
                    </span>
                    {answer.isEdited && (
                      <span className="text-sm text-gray-500">(edited)</span>
                    )}
                    {answer.isAccepted && (
                      <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                        <CheckCircleIcon className="h-4 w-4" />
                        Accepted
                      </span>
                    )}
                    <div className="flex items-center gap-4 mt-1 px-4">
                      {currentUserId === answer.user.id && (
                        // <>
                        //   <button
                        //     onClick={() => handleEditClick(answer)}
                        //     className="text-sm text-gray-500 hover:text-gray-700"
                        //   >
                        //     Edit
                        //   </button>
                        //   <button
                        //     onClick={() => onAnswerDelete(answer.id)}
                        //     className="text-sm text-gray-500 hover:text-red-600"
                        //   >
                        //     Delete
                        //   </button>
                        // </>
                        <>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(answer)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
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
                        <Tooltip title="Accept Answer">
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

                  {/* Answer Content */}
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
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(answer.id)}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                          Save
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

                {/* Actions */}
                {/* <div className="flex items-center gap-4 mt-1 px-4">
                  {currentUserId === answer.user.id && (
                    <>
                      <button
                        onClick={() => handleEditClick(answer)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onAnswerDelete(answer.id)}
                        className="text-sm text-gray-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {userRole == "admin" && !answer.isAccepted && (
                    <button
                      onClick={() => onAnswerAccepted(answer.id)}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      Accept
                    </button>
                  )}
                </div> */}

                {/* Comments */}
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
