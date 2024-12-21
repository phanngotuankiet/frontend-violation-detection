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
import Navbar from "../../dashboard/Navbar";
import Pagination from "../../pagination/Pagination";

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
  const [statusFilter, setStatusFilter] = useState<SearchStatus | "all">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(10);

  const fetchSearches = async (page: number = currentPage) => {
    try {
      setLoading(true);
      const data = await searchService.getSensitiveSearches(page, itemsPerPage);

      setSearches(data.data);
      setTotalPages(data.meta.lastPage);
      setError(null);
    } catch (err) {
      setError("Failed to fetch searches");
      console.error("Error fetching searches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearches(currentPage);

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
  }, [currentPage]);

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
  const filteredSearches = searches.filter((search) =>
    statusFilter === "all" ? true : search.status === statusFilter
  );
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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-left">
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lí tìm kiếm của người dùng
          </h1>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-center
                   text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No.
                  </th>
                  <th
                    className="px-6 py-3 text-center
                   text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nội dung tìm kiếm
                  </th>
                  <th
                    className="px-6 py-3 text-center
                   text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="relative inline-flex items-center space-x-1">
                      <span>Trạng thái</span>
                      {/* <select
                        value={statusFilter}
                        onChange={(e) =>
                          setStatusFilter(
                            e.target.value as SearchStatus | "all"
                          )
                        }
                        className="block w-32 text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="flagged">Flagged</option>
                      </select> */}
                      <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="inline-flex items-center"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            isFilterOpen ? "transform rotate-180" : ""
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {isFilterOpen && (
                        <div className="absolute right-0 mt-2 top-full z-10 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setStatusFilter("all");
                                setIsFilterOpen(false);
                              }}
                              className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                            >
                              Tất cả
                            </button>
                            <button
                              onClick={() => {
                                setStatusFilter("pending");
                                setIsFilterOpen(false);
                              }}
                              className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                            >
                              Chờ xử lí
                            </button>
                            <button
                              onClick={() => {
                                setStatusFilter("reviewed");
                                setIsFilterOpen(false);
                              }}
                              className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                            >
                              Đã xử lí
                            </button>
                            <button
                              onClick={() => {
                                setStatusFilter("flagged");
                                setIsFilterOpen(false);
                              }}
                              className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                            >
                              Đã gắn cờ
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-center
                   text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thời gian
                  </th>
                  <th
                    className="px-6 py-3 text-center
                   text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSearches.map((search, index) => (
                  <tr
                    key={search.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {search.searchTerm}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        search.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : search.status === "reviewed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      >
                        {search.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(search.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              search.id,
                              "reviewed" as SearchStatus
                            )
                          }
                          disabled={
                            search.status === ("reviewed" as SearchStatus)
                          }
                          className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                            search.status === ("reviewed" as SearchStatus)
                              ? "border-gray-200 text-gray-400 cursor-not-allowed"
                              : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                          }`}
                        >
                          Xử lí
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              search.id,
                              "flagged" as SearchStatus
                            )
                          }
                          disabled={
                            search.status === ("flagged" as SearchStatus)
                          }
                          className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                            search.status === ("flagged" as SearchStatus)
                              ? "border-gray-200 text-gray-400 cursor-not-allowed"
                              : "border-red-500 text-red-600 hover:bg-red-50"
                          }`}
                        >
                          Gắn cờ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          fetchSearches(page);
        }}
      />
    </div>
  );
};

export default SearchMonitoringDashboard;
