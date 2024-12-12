// src/components/admin/SearchStats.tsx
import React from "react";
import { searchService } from "../../../../api/search.service";

import { Paper, Typography, Grid, Card, CardContent, Box } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SearchStatsProps {
  stats: {
    totalSearches: number;
    categoryCounts: {
      category: string;
      status: string;
      _count: number;
    }[];
  };
}

const SearchStats: React.FC<SearchStatsProps> = ({ stats }) => {
  const chartData = {
    labels: ["Political", "Adult", "Scam", "Violence"],
    datasets: [
      {
        label: "Sensitive Searches by Category",
        data: stats.categoryCounts.map((count) => count._count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(255, 205, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
      },
    ],
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Search Statistics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Searches</Typography>
              <Typography variant="h3">{stats.totalSearches}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Bar data={chartData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchStats;
