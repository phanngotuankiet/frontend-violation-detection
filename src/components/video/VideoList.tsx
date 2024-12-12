// src/components/user/VideoList.tsx
import React from "react";
import { Grid, Card, CardContent, Typography, CardMedia } from "@mui/material";
import { Video } from "@/constant/Video";

// interface Video {
//   id: number;
//   title: string;
//   description: string;
//   thumbnailUrl: string;
// }

interface VideoListProps {
  videos: Video[];
}

const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  return (
    <Grid container spacing={3}>
      {videos.map((video) => (
        <Grid item xs={12} sm={6} md={4} key={video.id}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={video.thumbnailUrl}
              alt={video.title}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {video.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {video.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default VideoList;
