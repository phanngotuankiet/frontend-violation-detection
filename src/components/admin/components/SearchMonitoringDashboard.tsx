/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/admin/SearchMonitoringDashboard.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import io from "socket.io-client";
import { searchService } from "../../../../api/search.service";
import { SearchStatus } from "../../../websocket/websocket.types";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";

interface SensitiveSearch {
  id: number;
  searchTerm: string;
  category: string;
  status: SearchStatus;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const SearchMonitoringDashboard: React.FC = () => {
  const [searches, setSearches] = useState<SensitiveSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const searchesRef = useRef<SensitiveSearch[]>([]);

  const fetchSearches = async () => {
    try {
      setLoading(true);
      const data = await searchService.getSensitiveSearches();
      setSearches(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch searches");
      console.error("Error fetching searches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearches();

    socketRef.current = io("http://localhost:3000", {
      auth: { token: localStorage.getItem("access_token") },
      query: { isAdmin: "true" },
    });

    const handleNewSearch = (data: SensitiveSearch) => {
      console.log("Received new search:", data);
      setSearches((prev) => {
        const updated = [
          data,
          ...prev.filter((search) => search.id !== data.id),
        ];
        console.log("Updated searches:", updated);
        return updated;
      });
    };

    socketRef.current.on("newSensitiveSearch", handleNewSearch);
    socketRef.current.on("sensitiveSearchAlert", handleNewSearch);

    return () => {
      socketRef.current?.off("newSensitiveSearch", handleNewSearch);
      socketRef.current?.off("sensitiveSearchAlert", handleNewSearch);
      socketRef.current?.disconnect();
    };
  }, []);

  const handleStatusUpdate = async (id: number, status: SearchStatus) => {
    try {
      setLoading(true);
      await searchService.updateSearchStatus(id, status);

      socketRef.current?.emit("updateSearchStatus", { id, status });

      setSearches((prev) => {
        const updated = prev.map((search) =>
          search.id === id ? { ...search, status } : search
        );
        console.log("Updated searches after status change:", updated);
        return updated;
      });
    } catch (error) {
      setError("Failed to update status");
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Sensitive Search Monitoring
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Search Term</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searches.map((search) =>
            search && search.user ? ( // Add null check
              <TableRow key={search.id}>
                <TableCell>
                  <Typography variant="subtitle2">
                    {search.user.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {search.user.email}
                  </Typography>
                </TableCell>
                <TableCell>{search.searchTerm}</TableCell>
                <TableCell>
                  <Chip
                    label={search.category}
                    color={
                      search.category === "political"
                        ? "error"
                        : search.category === "adult"
                        ? "warning"
                        : search.category === "scam"
                        ? "secondary"
                        : "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={search.status}
                    color={
                      search.status === "pending"
                        ? "warning"
                        : search.status === "reviewed"
                        ? "success"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(search.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleStatusUpdate(search.id, "reviewed")}
                      disabled={search.status === "reviewed"}
                    >
                      Review
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleStatusUpdate(search.id, "flagged")}
                      disabled={search.status === "flagged"}
                    >
                      Flag
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : null
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default SearchMonitoringDashboard;
