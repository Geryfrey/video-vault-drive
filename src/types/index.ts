
export type User = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  avatarUrl?: string;
};

export type ProcessingStatus = "pending" | "processing" | "completed" | "error";

export type VideoFormat = "mp4" | "avi" | "mkv" | "mov" | "webm";
export type VideoResolution = "360p" | "480p" | "720p" | "1080p" | "4k";

export type Video = {
  id: string;
  title: string;
  status: ProcessingStatus;
  originalFormat: VideoFormat;
  targetFormat: VideoFormat;
  targetResolution: VideoResolution;
  createdAt: string;
  completedAt?: string;
  size: number; // in bytes
  duration: number; // in seconds
  thumbnailUrl: string;
  driveUrl?: string;
  ownerId: string;
  subtitlesUrl?: string; // URL to the subtitles file
  thumbnails?: string[]; // Array of thumbnail URLs
};

export type ProcessingOptions = {
  targetFormat: VideoFormat;
  targetResolution: VideoResolution;
  compress: boolean;
  generateSubtitles?: boolean;
};
