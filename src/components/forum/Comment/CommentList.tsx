// src/components/Comment/CommentList.tsx
import React, { useState, useEffect } from "react";
import { TextField, IconButton, Tooltip } from "@mui/material";
// import ReplyIcon from "@mui/icons-material/Reply";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useAuth } from "../../../context/AuthContext";
import { commentApi } from "../../../../api/forum.service";
import Comment from "@/constant/Comment";

interface CommentListProps {
  answerId: number;
}

const CommentList: React.FC<CommentListProps> = ({ answerId }) => {
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
  // const handleReplyClick = () => {
  //   setShowReplyField(true);
  // };

  // const handleCancelReply = () => {
  //   setShowReplyField(false);
  //   setNewComment("");
  // };
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
      console.error("Failed to add comment:", error);
    }
  };

  const handleEdit = async (commentId: number) => {
    try {
      await commentApi.update(commentId, { content: editContent });
      setEditingId(null);
      setEditContent("");
      fetchComments();
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await commentApi.delete(commentId);
      fetchComments();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    // <Box sx={{ mt: 2 }}>
    //   <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
    //     <Button
    //       size="small"
    //       startIcon={<ReplyIcon />}
    //       onClick={handleReplyClick}
    //       disabled={showReplyField}
    //     >
    //       Reply
    //     </Button>
    //   </Box>
    //   {showReplyField && (
    //     <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
    //       <TextField
    //         size="small"
    //         fullWidth
    //         multiline
    //         rows={2}
    //         placeholder="Write your reply..."
    //         value={newComment}
    //         onChange={(e) => setNewComment(e.target.value)}
    //       />
    //       <Box
    //         sx={{ display: "flex", gap: 1, mt: 1, justifyContent: "flex-end" }}
    //       >
    //         <Button size="small" variant="outlined" onClick={handleCancelReply}>
    //           Cancel
    //         </Button>
    //         <Button
    //           type="submit"
    //           variant="contained"
    //           size="small"
    //           disabled={!newComment.trim()}
    //         >
    //           Post Reply
    //         </Button>
    //       </Box>
    //     </Box>
    //   )}
    //   <Divider sx={{ my: 2 }} />
    //   <List dense>
    //     {comments.map((comment) => (
    //       <ListItem key={comment.id} sx={{ display: "block", py: 1 }}>
    //         {editingId === comment.id ? (
    //           <Box sx={{ display: "flex", gap: 1 }}>
    //             <TextField
    //               size="small"
    //               fullWidth
    //               value={editContent}
    //               onChange={(e) => setEditContent(e.target.value)}
    //             />
    //             <Button size="small" onClick={() => handleEdit(comment.id)}>
    //               Save
    //             </Button>
    //             <Button size="small" onClick={() => setEditingId(null)}>
    //               Cancel
    //             </Button>
    //           </Box>
    //         ) : (
    //           <>
    //             <Typography variant="body2">{comment.content}</Typography>
    //             <Box
    //               sx={{
    //                 display: "flex",
    //                 justifyContent: "space-between",
    //                 alignItems: "center",
    //               }}
    //             >
    //               <Typography variant="caption" color="text.secondary">
    //                 {comment.user.name} •{" "}
    //                 {new Date(comment.createdAt).toLocaleDateString()}
    //                 {comment.isEdited && " (edited)"}
    //               </Typography>
    //               {currentUser?.id === comment.userId && (
    //                 <Box>
    //                   <Button
    //                     size="small"
    //                     startIcon={<EditIcon />}
    //                     onClick={() => {
    //                       setEditingId(comment.id);
    //                       setEditContent(comment.content);
    //                     }}
    //                   >
    //                     Edit
    //                   </Button>
    //                   <Button
    //                     size="small"
    //                     color="error"
    //                     startIcon={<DeleteIcon />}
    //                     onClick={() => handleDelete(comment.id)}
    //                   >
    //                     Delete
    //                   </Button>
    //                 </Box>
    //               )}
    //             </Box>
    //           </>
    //         )}
    //       </ListItem>
    //     ))}
    //   </List>
    // </Box>
    <div className="space-y-4 mt-3">
      {/* Reply Button */}
      {/* <button
        onClick={() => setShowReplyField(true)}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Reply to answer
      </button> */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setShowReplyField(true)}
          className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1"
        >
          Reply
        </button>
      </div>

      {/* Reply Field */}
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
              placeholder="Write a comment..."
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
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!newComment.trim()}
                className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg disabled:opacity-50"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            {/* Comment Avatar */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {comment.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Comment Content */}
            <div className="flex-1">
              <div className="bg-gray-100 rounded-2xl px-4 py-2">
                {/* User Info & Timestamp */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900">
                    {comment.user.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                  {comment.isEdited && (
                    <span className="text-xs text-gray-500">(edited)</span>
                  )}
                  {currentUser?.id === comment.userId && !editingId && (
                    <div className="flex items-center gap-2 mt-1 ml-4">
                      <Tooltip title="Edit">
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
                      <Tooltip title="Delete">
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
                        Cancel
                      </button>
                      <button
                        onClick={() => handleEdit(comment.id)}
                        className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-lg"
                      >
                        Save
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

              {/* Comment Actions */}
              {/* {currentUser?.id === comment.userId && !editingId && (
                <div className="flex items-center gap-2 mt-1 ml-4">
                  <Tooltip title="Edit">
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
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(comment.id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
