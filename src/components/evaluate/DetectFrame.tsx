import { useEffect, useRef, useState } from "react";
import {
  DetectionResponse,
  DetectionResult,
  videoService,
} from "../../../api/video.service";
import axios from "axios";

interface DetectFrameProps {
  videoFile: File | null;
  isEnabled: boolean;
  isUploading?: boolean;
}

interface DetectedActivity {
  activity: string;
  confidence: number;
  timestamp: string;
  timeCode: string;
}

export default function DetectFrame({
  videoFile,
  isEnabled,
  isUploading = false,
}: DetectFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const processingQueue = useRef<Promise<void>>(Promise.resolve());
  const [currentActivity, setCurrentActivity] =
    useState<DetectedActivity | null>(null);
  const [detectionLog, setDetectionLog] = useState<DetectedActivity[]>([]);
  const lastProcessedTime = useRef(0);
  const FRAME_INTERVAL = 1000 / 10; // Process 10 frames per second

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const updateOverlay = (activity: DetectedActivity) => {
    const overlay = overlayRef.current;
    const ctx = overlay?.getContext("2d");
    if (!ctx || !overlay) return;

    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const isNormal = activity.activity === "normal";
    ctx.fillStyle = isNormal
      ? "rgba(34, 197, 94, 0.9)"
      : "rgba(220, 38, 38, 0.9)";
    ctx.fillRect(0, 0, overlay.width, overlay.height);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 24px Arial";
    ctx.fillText(
      activity.activity.toUpperCase(),
      overlay.width / 2,
      overlay.height / 2 - 15
    );

    ctx.font = "bold 20px Arial";
    ctx.fillText(
      `${(activity.confidence * 100).toFixed(1)}%`,
      overlay.width / 2,
      overlay.height / 2 + 15
    );
  };

  const processFrame = async (timestamp: number) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (
      !video ||
      !canvas ||
      !ctx ||
      video.paused ||
      video.ended ||
      isUploading
    ) {
      requestRef.current = requestAnimationFrame(processFrame);
      return;
    }

    if (timestamp - lastProcessedTime.current < FRAME_INTERVAL) {
      requestRef.current = requestAnimationFrame(processFrame);
      return;
    }

    lastProcessedTime.current = timestamp;

    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95)
      );

      // Add to processing queue
      processingQueue.current = processingQueue.current.then(async () => {
        try {
          const result = await videoService.detectFrame(blob);
          if (result?.status === "success" && result.data) {
            const { confidences, detected_activities } = result.data;
            const activity = {
              activity: detected_activities?.[0] || "normal",
              confidence: confidences
                ? Math.max(...Object.values(confidences))
                : 0,
              timestamp: new Date().toLocaleTimeString(),
              timeCode: formatTime(video.currentTime),
            };

            setCurrentActivity(activity);
            setDetectionLog((prev) => [...prev, activity]);
            updateOverlay(activity);
          }
        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error("Frame processing error:", error);
          }
        }
      });
    } catch (error) {
      console.error("Canvas error:", error);
    }

    requestRef.current = requestAnimationFrame(processFrame);
  };

  useEffect(() => {
    if (!videoFile || !isEnabled) return;

    const videoUrl = URL.createObjectURL(videoFile);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;

    if (!video || !canvas || !overlay) return;

    video.src = videoUrl;
    video.controls = true;

    const handleMetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      overlay.width = video.videoWidth;
      overlay.height = video.videoHeight;

      // Only autoplay if not uploading
      if (!isUploading) {
        video.play();
      }
    };

    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("play", () => {
      requestRef.current = requestAnimationFrame(processFrame);
    });

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.pause();
      video.src = "";
      URL.revokeObjectURL(videoUrl);

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      const overlayCtx = overlay.getContext("2d");
      if (overlayCtx) {
        overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
      }

      setCurrentActivity(null);
      setDetectionLog([]);
    };
  }, [videoFile, isEnabled]);

  // Watch for changes in isUploading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isUploading) {
      video.pause();
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    } else {
      video.play();
    }
  }, [isUploading]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl">
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                controls
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />
              <canvas ref={overlayRef} className="hidden" />

              {currentActivity && (
                <div
                  className={`absolute top-4 right-4 w-44 h-24 rounded-lg flex flex-col items-center justify-center ${
                    currentActivity.activity === "normal"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  <div className="text-white font-bold text-xl">
                    {currentActivity.activity.toUpperCase()}
                  </div>
                  <div className="text-white text-lg">
                    {`${(currentActivity.confidence * 100).toFixed(1)}%`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-xl h-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Detection Log</h2>
            </div>
            <div className="p-4">
              <div className="h-[calc(100vh-10px)] overflow-y-auto space-y-2">
                {detectionLog.map((log, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      log.activity === "normal"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-semibold ${
                          log.activity === "normal"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {log.activity.toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {log.timeCode}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      Confidence: {(log.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
