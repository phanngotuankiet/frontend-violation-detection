// src/components/user/SearchBar.tsx
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TextField,
  IconButton,
  Paper,
  CircularProgress,
  Chip,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import HistoryIcon from "@mui/icons-material/History";
import ClearIcon from "@mui/icons-material/Clear";
import { searchService } from "../../../api/search.service";
import VideoList from "../video/VideoList";
import io, { Socket } from "socket.io-client";
import { Video } from "../../constant/Video";

const SEARCH_FILTERS = [
  "Tất cả",
  "Đánh nhau",
  "Trộm cắp",
  "Tai nạn",
  "Cướp giật",
  "Phá hoại",
];

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("Tất cả");
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
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
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setShowHistory(false);

    try {
      const sensitiveCheck = await searchService.checkSearch({ searchTerm });

      if (sensitiveCheck.isSensitive) {
        const sensitiveData = {
          id: sensitiveCheck?.id,
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
        setError(sensitiveCheck.message || "Nội dung tìm kiếm nhạy cảm");
        return;
      }

      const result = await searchService.searchVideos(searchTerm);
      const formattedVideos = (result.videos || []).map(
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
      setSearchHistory((prev) =>
        [...new Set([searchTerm, ...prev])].slice(0, 5)
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <Paper
        elevation={3}
        className="relative"
        sx={{
          p: 2,
          borderRadius: "16px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            className="hover:bg-gray-100"
          >
            <FilterListIcon />
          </IconButton>

          <TextField
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm video..."
            variant="standard"
            InputProps={{
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
          />

          <Tooltip title="Lịch sử tìm kiếm">
            <IconButton onClick={() => setShowHistory(!showHistory)}>
              <HistoryIcon />
            </IconButton>
          </Tooltip>

          <IconButton
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <SearchIcon />
            )}
          </IconButton>
        </form>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-wrap gap-2 mt-4"
            >
              {SEARCH_FILTERS.map((filter) => (
                <Chip
                  key={filter}
                  label={filter}
                  onClick={() => setSelectedFilter(filter)}
                  color={selectedFilter === filter ? "primary" : "default"}
                  variant={selectedFilter === filter ? "filled" : "outlined"}
                />
              ))}
            </motion.div>
          )}

          {showHistory && searchHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-10"
            >
              <div className="p-2">
                {searchHistory.map((term, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg flex items-center"
                    onClick={() => {
                      setSearchTerm(term);
                      setShowHistory(false);
                    }}
                  >
                    <HistoryIcon className="text-gray-400 mr-2" />
                    <span>{term}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-center"
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8"
          >
            <VideoList videos={videos} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
