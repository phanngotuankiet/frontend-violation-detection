// src/components/user/SearchBar.tsx
import React, { useRef, useState } from "react";
import { TextField, IconButton, Paper, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { searchService } from "../../../api/search.service";
import VideoList from "../video/VideoList";
import io, { Socket } from "socket.io-client";
import { Video } from "../../constant/Video";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  React.useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const sensitiveCheck = await searchService.checkSearch({ searchTerm });

      if (sensitiveCheck.isSensitive) {
        const sensitiveData = {
          id: sensitiveCheck.id,
          searchTerm,
          category: sensitiveCheck.category,
          status: "pending",
          user: {
            name: user.name || "",
            email: user.email || "",
          },
          createdAt: new Date().toISOString(),
        };

        socketRef.current?.emit("newSensitiveSearch", sensitiveData);
        setError(sensitiveCheck.message || "Sensitive content detected");
        return;
      }

      const result = await searchService.searchVideos(searchTerm);
      const formattedVideos: Video[] = (result.videos || []).map(
        (video: Partial<Video>) => ({
          id: video.id!,
          title: video.title || "",
          description: video.description || "",
          thumbnailUrl: video.thumbnailUrl || "",
          url: video.url || "",
          createdAt: video.createdAt || new Date().toISOString(),
        })
      );

      setVideos(formattedVideos);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        <TextField
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search videos..."
          sx={{ ml: 1, flex: 1 }}
        />
        <IconButton type="submit" disabled={loading} sx={{ p: "10px" }}>
          {loading ? <CircularProgress size={24} /> : <SearchIcon />}
        </IconButton>
      </Paper>

      {error && (
        <div className="text-red-600 text-sm mt-2 text-center">{error}</div>
      )}

      {videos.length > 0 && <VideoList videos={videos} />}
    </div>
  );
};

export default SearchBar;
